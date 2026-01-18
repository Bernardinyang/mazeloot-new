<script setup lang="ts">
import type { BulletLegendItemInterface } from "@unovis/ts"
import type { Component } from "vue"
import { omit } from "@unovis/ts"
import { VisTooltip } from "@unovis/vue"
import { createApp } from "vue"
import ChartTooltip from "./ChartTooltip.vue"

// #region agent log
const log = (message, data) => { fetch('http://127.0.0.1:7242/ingest/0c1f4b73-4437-4f70-a7a0-856984785a37', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'ChartSingleTooltip.vue:SCRIPT', message, data, timestamp: Date.now(), sessionId: 'debug-session' }) }).catch(() => {}); }
// #endregion

const props = defineProps<{
  selector: string
  index: string
  items?: BulletLegendItemInterface[]
  valueFormatter?: (tick: number, i?: number, ticks?: number[]) => string
  customTooltip?: Component
}>()

// #region agent log
import { onMounted } from 'vue'
onMounted(() => {
  log('ChartSingleTooltip mounted', {
    selector: props.selector,
    selectorType: typeof props.selector,
    selectorLength: props.selector?.length,
    selectorValue: props.selector,
    hypothesisId: 'A'
  })
})
// #endregion

// Use weakmap to store reference to each datapoint for Tooltip
const wm = new WeakMap()
function template(d: any, i: number, elements: (HTMLElement | SVGElement)[]) {
  const valueFormatter = props.valueFormatter ?? ((tick: number) => `${tick}`)
  if (props.index in d) {
    if (wm.has(d)) {
      return wm.get(d)
    }
    else {
      const componentDiv = document.createElement("div")
      const omittedData = Object.entries(omit(d, [props.index])).map(([key, value]) => {
        const legendReference = props.items?.find(i => i.name === key)
        return { ...legendReference, value: valueFormatter(value) }
      })
      const TooltipComponent = props.customTooltip ?? ChartTooltip
      createApp(TooltipComponent, { title: d[props.index], data: omittedData }).mount(componentDiv)
      wm.set(d, componentDiv.innerHTML)
      return componentDiv.innerHTML
    }
  }

  else {
    const data = d.data

    if (wm.has(data)) {
      return wm.get(data)
    }
    else {
      const style = getComputedStyle(elements[i])
      const omittedData = [{ name: data.name, value: valueFormatter(data[props.index]), color: style.fill }]
      const componentDiv = document.createElement("div")
      const TooltipComponent = props.customTooltip ?? ChartTooltip
      createApp(TooltipComponent, { title: d[props.index], data: omittedData }).mount(componentDiv)
      wm.set(d, componentDiv.innerHTML)
      return componentDiv.innerHTML
    }
  }
}
</script>

<template>
  <!-- #region agent log -->
  <!-- {{ (() => { log('VisTooltip triggers object', { selector: props.selector, triggersKey: Object.keys({ [props.selector]: template })[0], hypothesisId: 'A' }); return ''; })() }} -->
  <!-- #endregion -->
  <VisTooltip
    :horizontal-shift="20" :vertical-shift="20" :triggers="{
      [selector]: template,
    }"
  />
</template>
