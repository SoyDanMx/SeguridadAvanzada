#!/usr/bin/env python3
"""
Script para blindar el workflow de Kapso AI contra falsas promesas de pick-up,
retiro en oficinas no autorizado y bypass del checkout de Shopify.
Actualiza workflow.js y definition.json en workflows/untitled-workflow.
"""

import os
import re

TARGET_DIR = '/Users/danielnuno/SeguridadAvanzadaShop/kapso-workflows/workflows/untitled-workflow'
WF_FILE = os.path.join(TARGET_DIR, 'workflow.js')
DEF_FILE = os.path.join(TARGET_DIR, 'definition.json')

with open(WF_FILE, 'r', encoding='utf-8') as f:
    wf_content = f.read()

with open(DEF_FILE, 'r', encoding='utf-8') as f:
    def_content = f.read()

# 1. Modificar la promesa de liberación inmediata en el cierre directo SA
old_closing = "Una vez que pagues en la web o transfieras, responde este mensaje con tu Nombre Completo y Dirección de Envío para liberar tu paquete hoy mismo. 🚀"
new_closing = "Una vez que pagues en la web o transfieras, responde este mensaje con tu Nombre Completo y Dirección de Envío para procesar tu orden y coordinar el envío asegurado a tu domicilio. 🚀"

if old_closing in wf_content:
    wf_content = wf_content.replace(old_closing, new_closing)
    print("✅ Actualizado cierre directo en workflow.js")

if old_closing in def_content:
    def_content = def_content.replace(old_closing, new_closing)
    print("✅ Actualizado cierre directo en definition.json")

# 2. Agregar Reglas de Guardia 11, 12 y 13 en REGLAS DE GUARDIA
old_rules = """10. PRESENTACIÓN EN CATÁLOGO: Siempre preséntate con "¡Hola! Soy el asistente virtual de Grupo Nuo Networks..." antes de mostrar un producto (solo en consultas orgánicas, NO en cierre directo desde catálogo web).`"""

new_rules = """10. PRESENTACIÓN EN CATÁLOGO: Siempre preséntate con "¡Hola! Soy el asistente virtual de Grupo Nuo Networks..." antes de mostrar un producto (solo en consultas orgánicas, NO en cierre directo desde catálogo web).
11. 🚨 PROHIBIDO PROMETER RECOLECCIÓN EN OFICINAS O MOSTRADOR (ANTI-PICKUP ALUCINADO):
    Queda TERMINANTEMENTE PROHIBIDO prometer al cliente que puede "pasar a recoger a nuestras oficinas", asegurar horarios de mostrador (ej. "de lunes a viernes de 9 a 6") o comprometer entregas en 24 horas. Los equipos se despachan desde centros de distribución y almacenes mayoristas con envío asegurado por paquetería a domicilio (2 a 4 días hábiles promedio nacional).
12. 🚨 PROHIBIDO INSTRUIR AL CLIENTE A BYPASSEAR EL CHECKOUT DE SHOPIFY:
    Si el cliente menciona que en la tienda solo ve "Envío a domicilio" y no encuentra opción de "Pick-up / Recolección", PROHIBIDO decirle que pague con envío a domicilio y que tú lo ajustas internamente. Explícale claramente: "Nuestra tienda en línea está configurada exclusivamente para envíos asegurados a domicilio por paquetería para garantizar la póliza de seguro de los equipos."
13. 🚨 ATENCIÓN DE PEDIDOS URGENTES, RETIRO EN PERSONA O DUDAS DE TIEMPO MENOR A 48H:
    Si el cliente pregunta explícitamente: "¿puedo pasar a recoger hoy o mañana?", "lo necesito urgente para mañana", "¿dónde están ubicados para pasar a recogerlo?", o insiste en recoger físicamente:
    → Responde INMEDIATAMENTE:
    "Nuestros despachos regulares se realizan por paquetería asegurada a domicilio (2 a 4 días hábiles). Para verificar si este equipo específico cuenta con inventario local en bodega CDMX para entrega urgente o retiro programado, estoy canalizando tu solicitud de inmediato con Daniel, nuestro coordinador logístico. En unos momentos estará contigo. 👨‍💻📦"
    → alertar_daniel reason="[customer_name] - Solicita retiro en persona o entrega urgente para SKU: [sku_pedido] - Conversation ID: [conversation_id]"
    → save_variable clave=handoff_activo valor=true
    → handoff_to_human`"""

if old_rules in wf_content:
    wf_content = wf_content.replace(old_rules, new_rules)
    print("✅ Agregadas reglas 11, 12, 13 en workflow.js")
else:
    print("⚠️ No se encontró el bloque exacto en workflow.js")

# Para definition.json necesitamos escapar los saltos de línea y comillas si corresponde
old_rules_escaped = old_rules.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
# pero en definition.json la cadena original termina con ` antes del cierre JSON
# Busquemos la regla 10 en definition.json
match = re.search(r'10\.\s*PRESENTACI[^\n\\]*?\.\.\."\s*antes de mostrar un producto \(solo en consultas org[^\n\\]*?\)\.', def_content)
if match:
    idx = match.end()
    extra_rules_json = "\\n11. 🚨 PROHIBIDO PROMETER RECOLECCIÓN EN OFICINAS O MOSTRADOR (ANTI-PICKUP ALUCINADO):\\n    Queda TERMINANTEMENTE PROHIBIDO prometer al cliente que puede \\\"pasar a recoger a nuestras oficinas\\\", asegurar horarios de mostrador (ej. \\\"de lunes a viernes de 9 a 6\\\") o comprometer entregas en 24 horas. Los equipos se despachan desde centros de distribución y almacenes mayoristas con envío asegurado por paquetería a domicilio (2 a 4 días hábiles promedio nacional).\\n12. 🚨 PROHIBIDO INSTRUIR AL CLIENTE A BYPASSEAR EL CHECKOUT DE SHOPIFY:\\n    Si el cliente menciona que en la tienda solo ve \\\"Envío a domicilio\\\" y no encuentra opción de \\\"Pick-up / Recolección\\\", PROHIBIDO decirle que pague con envío a domicilio y que tú lo ajustas internamente. Explícale claramente: \\\"Nuestra tienda en línea está configurada exclusivamente para envíos asegurados a domicilio por paquetería para garantizar la póliza de seguro de los equipos.\\\"\\n13. 🚨 ATENCIÓN DE PEDIDOS URGENTES, RETIRO EN PERSONA O DUDAS DE TIEMPO MENOR A 48H:\\n    Si el cliente pregunta explícitamente: \\\"¿puedo pasar a recoger hoy o mañana?\\\", \\\"lo necesito urgente para mañana\\\", \\\"¿dónde están ubicados para pasar a recogerlo?\\\", o insiste en recoger físicamente:\\n    → Responde INMEDIATAMENTE:\\n    \\\"Nuestros despachos regulares se realizan por paquetería asegurada a domicilio (2 a 4 días hábiles). Para verificar si este equipo específico cuenta con inventario local en bodega CDMX para entrega urgente o retiro programado, estoy canalizando tu solicitud de inmediato con Daniel, nuestro coordinador logístico. En unos momentos estará contigo. 👨‍💻📦\\\"\\n    → alertar_daniel reason=\\\"[customer_name] - Solicita retiro en persona o entrega urgente para SKU: [sku_pedido] - Conversation ID: [conversation_id]\\\"\\n    → save_variable clave=handoff_activo valor=true\\n    → handoff_to_human"
    def_content = def_content[:idx] + extra_rules_json + def_content[idx:]
    print("✅ Agregadas reglas 11, 12, 13 en definition.json")
else:
    print("⚠️ No se encontró la regla 10 en definition.json")

# Guardar archivos
with open(WF_FILE, 'w', encoding='utf-8') as f:
    f.write(wf_content)

with open(DEF_FILE, 'w', encoding='utf-8') as f:
    f.write(def_content)

print("🎉 Blindaje de workflow aplicado exitosamente.")
