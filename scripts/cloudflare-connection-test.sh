#!/bin/bash

# =============================================================================
# Cloudflare Connection Test - Prueba de Conexión con Cloudflare
# =============================================================================
# Propósito: Verificar que el despliegue con wrangler es correcto
# 
# Operaciones:
#   1. Conectar: Verificar autenticación con Cloudflare
#   2. Crear: worker demo, KV namespace, KV value, bucket R2 y directorio
#   3. Eliminar: Todos los recursos creados
#   4. Mostrar: Resultados de cada operación
#
# Uso: ./scripts/cloudflare-connection-test.sh
# =============================================================================

# No detenerse con errores - los manejamos manualmente
set +e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables de recursos demo
DEMO_WORKER_NAME="demo-connection-test-worker"
DEMO_KV_NAMESPACE="demo-connection-test-kv"
DEMO_KV_KEY="test-key"
DEMO_KV_VALUE="test-value-$(date +%s)"
DEMO_R2_BUCKET="demo-connection-test-r2"
DEMO_R2_DIR="dir-api-inmo"
DEMO_R2_FILE="test-file.txt"

# Contadores de resultados
SUCCESS_COUNT=0
FAILED_COUNT=0
SKIPPED_COUNT=0

# Array para almacenar resultados
declare -a RESULTS=()

# =============================================================================
# Funciones de utilidad
# =============================================================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_section() {
    echo ""
    echo "============================================================================="
    echo -e "${BLUE}$1${NC}"
    echo "============================================================================="
    echo ""
}

add_result() {
    local operation="$1"
    local status="$2"
    local details="$3"
    RESULTS+=("$operation|$status|$details")
    
    if [ "$status" == "SUCCESS" ]; then
        ((SUCCESS_COUNT++))
    elif [ "$status" == "FAILED" ]; then
        ((FAILED_COUNT++))
    elif [ "$status" == "SKIPPED" ]; then
        ((SKIPPED_COUNT++))
    fi
}

check_wrangler_installed() {
    log_info "Verificando wrangler instalado..."
    if ! command -v npx &> /dev/null; then
        log_error "npx no está instalado. Instala Node.js y npm."
        add_result "Verificar wrangler instalado" "FAILED" "npx no encontrado"
        return 1
    fi
    
    if ! npx wrangler --version &> /dev/null; then
        log_error "wrangler no está instalado. Ejecuta: npm install -g wrangler"
        add_result "Verificar wrangler instalado" "FAILED" "wrangler no encontrado"
        return 1
    fi
    
    log_success "wrangler está instalado: $(npx wrangler --version)"
    add_result "Verificar wrangler instalado" "SUCCESS" "$(npx wrangler --version)"
    return 0
}

# =============================================================================
# FASE 1: CONECTAR
# =============================================================================

phase_connect() {
    log_section "FASE 1: CONECTAR - Verificando autenticación con Cloudflare"
    
    # Verificar autenticación
    log_info "Verificando autenticación con 'wrangler whoami'..."
    
    if WHOAMI_OUTPUT=$(npx wrangler whoami 2>&1); then
        log_success "Autenticación correcta"
        echo "$WHOAMI_OUTPUT"
        add_result "Autenticación wrangler" "SUCCESS" "Usuario autenticado correctamente"
        
        # Extraer información de la cuenta
        ACCOUNT_NAME=$(echo "$WHOAMI_OUTPUT" | grep -oP 'Logged in as \K[^ ]+' || echo "N/A")
        log_info "Cuenta: $ACCOUNT_NAME"
    else
        log_error "No estás autenticado con Cloudflare"
        echo "$WHOAMI_OUTPUT"
        add_result "Autenticación wrangler" "FAILED" "No autenticado. Ejecuta: npx wrangler login"
        return 1
    fi
    
    return 0
}

# =============================================================================
# FASE 2: CREAR RECURSOS
# =============================================================================

phase_create() {
    log_section "FASE 2: CREAR - Creando recursos demo en Cloudflare"
    
    # -------------------------------------------------------------------------
    # 2.1: Crear Worker Demo
    # -------------------------------------------------------------------------
    log_info "Creando Worker Demo: $DEMO_WORKER_NAME..."
    
    # Crear archivo temporal para el worker
    TEMP_WORKER_DIR=$(mktemp -d)
    cat > "$TEMP_WORKER_DIR/index.js" << 'EOF'
export default {
  async fetch(request, env, ctx) {
    return new Response('Cloudflare Connection Test - Worker Demo', {
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};
EOF
    
    cat > "$TEMP_WORKER_DIR/wrangler.toml" << EOF
name = "$DEMO_WORKER_NAME"
main = "index.js"
compatibility_date = "2026-03-18"
EOF
    
    if npx wrangler deploy "$TEMP_WORKER_DIR/index.js" --name "$DEMO_WORKER_NAME" --dry-run 2>&1 | grep -q "Success"; then
        log_success "Worker Demo creado (dry-run exitoso)"
        add_result "Crear Worker Demo" "SUCCESS" "$DEMO_WORKER_NAME"
    else
        # Intentar deploy real
        if npx wrangler deploy "$TEMP_WORKER_DIR/index.js" --name "$DEMO_WORKER_NAME" 2>&1; then
            log_success "Worker Demo desplegado: $DEMO_WORKER_NAME"
            add_result "Crear Worker Demo" "SUCCESS" "$DEMO_WORKER_NAME"
        else
            log_warning "Worker Demo no se pudo crear (posible duplicado o error)"
            add_result "Crear Worker Demo" "SKIPPED" "Worker ya existe o error de despliegue"
        fi
    fi
    
    # Limpiar directorio temporal
    rm -rf "$TEMP_WORKER_DIR"
    
    # -------------------------------------------------------------------------
    # 2.2: Crear KV Namespace
    # -------------------------------------------------------------------------
    log_info "Creando KV Namespace: $DEMO_KV_NAMESPACE..."
    
    # wrangler 4.x usa 'wrangler kv namespace create' (sin dos puntos)
    KV_CREATE_OUTPUT=$(npx wrangler kv namespace create "$DEMO_KV_NAMESPACE" 2>&1)
    log_info "Output creación KV: $KV_CREATE_OUTPUT"
    
    # Extraer ID del output (puede tener varios formatos)
    # Formato 1: id = "xxxxx"
    # Formato 2: "id": "xxxxx"
    KV_NAMESPACE_ID=$(echo "$KV_CREATE_OUTPUT" | grep -oP 'id\s*=\s*"\K[a-f0-9]{32}' | head -1)
    
    # Si no se encontró, intentar con formato JSON
    if [ -z "$KV_NAMESPACE_ID" ]; then
        KV_NAMESPACE_ID=$(echo "$KV_CREATE_OUTPUT" | grep -oP '"id"\s*:\s*"\K[a-f0-9]{32}' | head -1)
    fi
    
    if [ -n "$KV_NAMESPACE_ID" ]; then
        log_success "KV Namespace creado: $DEMO_KV_NAMESPACE (ID: $KV_NAMESPACE_ID)"
        add_result "Crear KV Namespace" "SUCCESS" "$DEMO_KV_NAMESPACE (ID: $KV_NAMESPACE_ID)"
        
        # Guardar ID para uso posterior
        echo "$KV_NAMESPACE_ID" > /tmp/kv_namespace_id.txt
    else
        log_warning "KV Namespace no se pudo crear (posible duplicado)"
        # Intentar obtener ID existente listando namespaces
        log_info "Buscando namespace existente..."
        KV_LIST_OUTPUT=$(npx wrangler kv namespace list 2>&1)
        log_info "Output lista KV: $KV_LIST_OUTPUT"
        
        # Buscar en la lista el namespace por nombre
        KV_NAMESPACE_ID=$(echo "$KV_LIST_OUTPUT" | grep -A2 "$DEMO_KV_NAMESPACE" | grep -oP 'id\s*=\s*"\K[a-f0-9]{32}' | head -1)
        
        if [ -z "$KV_NAMESPACE_ID" ]; then
            # Intentar formato alternativo
            KV_NAMESPACE_ID=$(echo "$KV_LIST_OUTPUT" | grep -B1 "$DEMO_KV_NAMESPACE" | grep -oP '"id"\s*:\s*"\K[a-f0-9]{32}' | head -1)
        fi
        
        if [ -n "$KV_NAMESPACE_ID" ]; then
            log_info "Usando KV Namespace existente: $KV_NAMESPACE_ID"
            echo "$KV_NAMESPACE_ID" > /tmp/kv_namespace_id.txt
            add_result "Crear KV Namespace" "SKIPPED" "Namespace ya existe (ID: $KV_NAMESPACE_ID)"
        else
            log_error "No se pudo obtener el ID del KV Namespace"
            add_result "Crear KV Namespace" "FAILED" "No se pudo obtener ID"
        fi
    fi
    
    # -------------------------------------------------------------------------
    # 2.3: Crear KV Value
    # -------------------------------------------------------------------------
    log_info "Creando KV Value: $DEMO_KV_KEY = $DEMO_KV_VALUE..."
    
    if [ -f /tmp/kv_namespace_id.txt ]; then
        KV_ID=$(cat /tmp/kv_namespace_id.txt)
        log_info "Usando KV Namespace ID: $KV_ID"
        
        # wrangler 4.x usa 'wrangler kv key put' (sin dos puntos)
        KV_PUT_OUTPUT=$(npx wrangler kv key put --namespace-id "$KV_ID" "$DEMO_KV_KEY" "$DEMO_KV_VALUE" 2>&1)
        KV_PUT_EXIT=$?
        
        if [ $KV_PUT_EXIT -eq 0 ]; then
            log_success "KV Value creado: $DEMO_KV_KEY"
            add_result "Crear KV Value" "SUCCESS" "$DEMO_KV_KEY = $DEMO_KV_VALUE"
        else
            log_error "No se pudo crear el KV Value: $KV_PUT_OUTPUT"
            add_result "Crear KV Value" "FAILED" "Error al poner key en KV"
        fi
    else
        log_warning "No hay KV Namespace disponible para crear el value"
        add_result "Crear KV Value" "SKIPPED" "Sin namespace KV"
    fi
    
    # -------------------------------------------------------------------------
    # 2.4: Crear Bucket R2
    # -------------------------------------------------------------------------
    log_info "Creando R2 Bucket: $DEMO_R2_BUCKET..."
    
    R2_CREATE_OUTPUT=$(npx wrangler r2 bucket create "$DEMO_R2_BUCKET" 2>&1)
    R2_CREATE_EXIT=$?
    
    if [ $R2_CREATE_EXIT -eq 0 ]; then
        log_success "R2 Bucket creado: $DEMO_R2_BUCKET"
        add_result "Crear R2 Bucket" "SUCCESS" "$DEMO_R2_BUCKET"
    else
        # Verificar si ya existe
        if echo "$R2_CREATE_OUTPUT" | grep -qi "already exists\|bucket already exists"; then
            log_warning "R2 Bucket ya existe: $DEMO_R2_BUCKET"
            add_result "Crear R2 Bucket" "SKIPPED" "Bucket ya existe"
        else
            log_error "Error al crear R2 Bucket: $R2_CREATE_OUTPUT"
            add_result "Crear R2 Bucket" "FAILED" "$R2_CREATE_OUTPUT"
        fi
    fi
    
    # -------------------------------------------------------------------------
    # 2.5: Crear Directorio en R2
    # -------------------------------------------------------------------------
    log_info "Creando directorio en R2: $DEMO_R2_BUCKET/$DEMO_R2_DIR/..."
    
    # Crear archivo temporal para simular directorio
    TEMP_FILE=$(mktemp)
    echo "Directorio de prueba creado el $(date)" > "$TEMP_FILE"
    
    R2_PUT_OUTPUT=$(npx wrangler r2 object put "$DEMO_R2_BUCKET/$DEMO_R2_DIR/$DEMO_R2_FILE" --file "$TEMP_FILE" 2>&1)
    R2_PUT_EXIT=$?
    
    if [ $R2_PUT_EXIT -eq 0 ]; then
        log_success "Directorio R2 creado: $DEMO_R2_DIR/ (con archivo $DEMO_R2_FILE)"
        add_result "Crear Directorio R2" "SUCCESS" "$DEMO_R2_BUCKET/$DEMO_R2_DIR/"
    else
        log_warning "No se pudo crear el directorio en R2: $R2_PUT_OUTPUT"
        add_result "Crear Directorio R2" "SKIPPED" "Error al crear objeto en R2"
    fi
    
    rm -f "$TEMP_FILE"
    
    return 0
}

# =============================================================================
# FASE 3: ELIMINAR RECURSOS
# =============================================================================

phase_delete() {
    log_section "FASE 3: ELIMINAR - Limpiando recursos demo"
    
    # -------------------------------------------------------------------------
    # 3.1: Eliminar KV Value
    # -------------------------------------------------------------------------
    log_info "Eliminando KV Value: $DEMO_KV_KEY..."
    
    if [ -f /tmp/kv_namespace_id.txt ]; then
        KV_ID=$(cat /tmp/kv_namespace_id.txt)
        
        # wrangler 4.x usa 'wrangler kv key delete' (sin dos puntos)
        KV_DELETE_OUTPUT=$(npx wrangler kv key delete --namespace-id "$KV_ID" "$DEMO_KV_KEY" 2>&1)
        KV_DELETE_EXIT=$?
        
        if [ $KV_DELETE_EXIT -eq 0 ]; then
            log_success "KV Value eliminado: $DEMO_KV_KEY"
            add_result "Eliminar KV Value" "SUCCESS" "$DEMO_KV_KEY"
        else
            log_warning "No se pudo eliminar el KV Value: $KV_DELETE_OUTPUT"
            add_result "Eliminar KV Value" "SKIPPED" "Key no existe o error"
        fi
    else
        log_warning "No hay KV Namespace para eliminar el value"
        add_result "Eliminar KV Value" "SKIPPED" "Sin namespace KV"
    fi
    
    # -------------------------------------------------------------------------
    # 3.2: Eliminar KV Namespace
    # -------------------------------------------------------------------------
    log_info "Eliminando KV Namespace: $DEMO_KV_NAMESPACE..."
    
    if [ -f /tmp/kv_namespace_id.txt ]; then
        KV_ID=$(cat /tmp/kv_namespace_id.txt)
        
        # wrangler 4.x usa 'wrangler kv namespace delete' (sin dos puntos)
        KV_NS_DELETE_OUTPUT=$(npx wrangler kv namespace delete --namespace-id "$KV_ID" 2>&1)
        KV_NS_DELETE_EXIT=$?
        
        if [ $KV_NS_DELETE_EXIT -eq 0 ]; then
            log_success "KV Namespace eliminado: $DEMO_KV_NAMESPACE"
            add_result "Eliminar KV Namespace" "SUCCESS" "$DEMO_KV_NAMESPACE"
        else
            log_warning "No se pudo eliminar el KV Namespace: $KV_NS_DELETE_OUTPUT"
            add_result "Eliminar KV Namespace" "SKIPPED" "Error al eliminar namespace"
        fi
        
        rm -f /tmp/kv_namespace_id.txt
    else
        log_warning "No hay ID de KV Namespace para eliminar"
        add_result "Eliminar KV Namespace" "SKIPPED" "Sin ID de namespace"
    fi
    
    # -------------------------------------------------------------------------
    # 3.3: Eliminar Directorio en R2 (archivo de prueba)
    # -------------------------------------------------------------------------
    log_info "Eliminando archivo en R2: $DEMO_R2_BUCKET/$DEMO_R2_DIR/$DEMO_R2_FILE..."
    
    R2_DEL_OUTPUT=$(npx wrangler r2 object delete "$DEMO_R2_BUCKET/$DEMO_R2_DIR/$DEMO_R2_FILE" 2>&1)
    R2_DEL_EXIT=$?
    
    if [ $R2_DEL_EXIT -eq 0 ]; then
        log_success "Archivo R2 eliminado: $DEMO_R2_DIR/$DEMO_R2_FILE"
        add_result "Eliminar Archivo R2" "SUCCESS" "$DEMO_R2_DIR/$DEMO_R2_FILE"
    else
        log_warning "No se pudo eliminar el archivo R2: $R2_DEL_OUTPUT"
        add_result "Eliminar Archivo R2" "SKIPPED" "Archivo no existe o error"
    fi
    
    # -------------------------------------------------------------------------
    # 3.4: Eliminar Bucket R2
    # -------------------------------------------------------------------------
    log_info "Eliminando R2 Bucket: $DEMO_R2_BUCKET..."
    
    # Primero, limpiar cualquier objeto restante (eliminación recursiva)
    log_info "Limpiando objetos restantes en el bucket..."
    npx wrangler r2 object delete "$DEMO_R2_BUCKET" --recursive 2>/dev/null || true
    
    R2_BUCKET_DEL_OUTPUT=$(npx wrangler r2 bucket delete "$DEMO_R2_BUCKET" 2>&1)
    R2_BUCKET_DEL_EXIT=$?
    
    if [ $R2_BUCKET_DEL_EXIT -eq 0 ]; then
        log_success "R2 Bucket eliminado: $DEMO_R2_BUCKET"
        add_result "Eliminar R2 Bucket" "SUCCESS" "$DEMO_R2_BUCKET"
    else
        # Verificar si es error de bucket no vacío
        if echo "$R2_BUCKET_DEL_OUTPUT" | grep -qi "not empty\|bucket not empty"; then
            log_warning "El bucket no está vacío. Intentando limpiar..."
            # Listar y eliminar objetos uno por uno
            npx wrangler r2 object list "$DEMO_R2_BUCKET" 2>/dev/null | while read -r obj; do
                npx wrangler r2 object delete "$DEMO_R2_BUCKET/$obj" 2>/dev/null || true
            done
            # Reintentar eliminación
            R2_BUCKET_DEL_OUTPUT=$(npx wrangler r2 bucket delete "$DEMO_R2_BUCKET" 2>&1)
            R2_BUCKET_DEL_EXIT=$?
            if [ $R2_BUCKET_DEL_EXIT -eq 0 ]; then
                log_success "R2 Bucket eliminado: $DEMO_R2_BUCKET"
                add_result "Eliminar R2 Bucket" "SUCCESS" "$DEMO_R2_BUCKET"
            else
                log_warning "No se pudo eliminar el R2 Bucket: $R2_BUCKET_DEL_OUTPUT"
                add_result "Eliminar R2 Bucket" "SKIPPED" "Bucket no existe o error"
            fi
        else
            log_warning "No se pudo eliminar el R2 Bucket: $R2_BUCKET_DEL_OUTPUT"
            add_result "Eliminar R2 Bucket" "SKIPPED" "Bucket no existe o error"
        fi
    fi
    
    # -------------------------------------------------------------------------
    # 3.5: Eliminar Worker Demo
    # -------------------------------------------------------------------------
    log_info "Eliminando Worker Demo: $DEMO_WORKER_NAME..."
    
    # wrangler 4.x tiene comando 'wrangler delete [name]'
    WORKER_DEL_OUTPUT=$(npx wrangler delete "$DEMO_WORKER_NAME" 2>&1)
    WORKER_DEL_EXIT=$?
    
    if [ $WORKER_DEL_EXIT -eq 0 ]; then
        log_success "Worker Demo eliminado: $DEMO_WORKER_NAME"
        add_result "Eliminar Worker Demo" "SUCCESS" "$DEMO_WORKER_NAME"
    else
        # Verificar si el worker ya no existe
        if echo "$WORKER_DEL_OUTPUT" | grep -qi "not found\|no such resource\|does not exist"; then
            log_info "El Worker ya no existe"
            add_result "Eliminar Worker Demo" "SKIPPED" "Worker ya eliminado"
        else
            log_warning "No se pudo eliminar el Worker Demo: $WORKER_DEL_OUTPUT"
            add_result "Eliminar Worker Demo" "SKIPPED" "Error al eliminar worker"
        fi
    fi
    
    return 0
}

# =============================================================================
# FASE 4: MOSTRAR RESULTADOS
# =============================================================================

phase_show_results() {
    log_section "FASE 4: MOSTRAR RESULTADOS"
    
    echo ""
    echo "┌─────────────────────────────────────────────────────────────────────┐"
    echo "│                    RESULTADOS DE LA PRUEBA                          │"
    echo "└─────────────────────────────────────────────────────────────────────┘"
    echo ""
    
    # Tabla de resultados
    printf "%-30s %-10s %s\n" "OPERACIÓN" "ESTADO" "DETALLES"
    printf "%-30s %-10s %s\n" "------------------------------" "----------" "--------------------"
    
    for result in "${RESULTS[@]}"; do
        IFS='|' read -r operation status details <<< "$result"
        
        # Color según estado
        case "$status" in
            "SUCCESS")
                status_color="${GREEN}"
                ;;
            "FAILED")
                status_color="${RED}"
                ;;
            "SKIPPED")
                status_color="${YELLOW}"
                ;;
            *)
                status_color="${NC}"
                ;;
        esac
        
        printf "%-30s ${status_color}%-10s${NC} %s\n" "$operation" "$status" "$details"
    done
    
    echo ""
    echo "============================================================================="
    echo "                           RESUMEN"
    echo "============================================================================="
    echo -e "  ${GREEN}SUCCESS:${NC}  $SUCCESS_COUNT"
    echo -e "  ${RED}FAILED:${NC}   $FAILED_COUNT"
    echo -e "  ${YELLOW}SKIPPED:${NC}  $SKIPPED_COUNT"
    echo "  ─────────────────────"
    TOTAL=$((SUCCESS_COUNT + FAILED_COUNT + SKIPPED_COUNT))
    echo "  TOTAL:     $TOTAL"
    echo ""
    
    if [ $FAILED_COUNT -eq 0 ]; then
        echo -e "${GREEN}✓ PRUEBA COMPLETADA EXITOSAMENTE${NC}"
        echo ""
        echo "La conexión con Cloudflare es correcta y wrangler está configurado apropiadamente."
        return 0
    else
        echo -e "${RED}✗ PRUEBA COMPLETADA CON ERRORES${NC}"
        echo ""
        echo "Revisa los errores arriba. Posibles causas:"
        echo "  - No estás autenticado: ejecuta 'npx wrangler login'"
        echo "  - wrangler no está instalado: ejecuta 'npm install -g wrangler'"
        echo "  - Permisos insuficientes en el API token de Cloudflare"
        return 1
    fi
}

# =============================================================================
# MAIN
# =============================================================================

main() {
    echo ""
    echo "╔═════════════════════════════════════════════════════════════════════╗"
    echo "║         CLOUDFLARE CONNECTION TEST - Prueba de Conexión            ║"
    echo "╚═════════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "Fecha: $(date)"
    echo "Propósito: Verificar que el despliegue con wrangler es correcto"
    echo ""
    
    # Verificar wrangler instalado
    if ! check_wrangler_installed; then
        phase_show_results
        exit 1
    fi
    
    # FASE 1: Conectar
    if ! phase_connect; then
        log_warning "Continuando sin autenticación completa..."
    fi
    
    # FASE 2: Crear
    phase_create
    
    # FASE 3: Eliminar
    phase_delete
    
    # FASE 4: Mostrar resultados
    phase_show_results
}

# Ejecutar main
main "$@"
