<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div class="space-y-2">
      <Label for="ea-discount" class="text-muted-foreground">Discount Percentage</Label>
      <Input
        id="ea-discount"
        v-model.number="form.discount_percentage"
        type="number"
        min="0"
        max="100"
        class="w-full"
      />
    </div>
    <div class="space-y-2">
      <Label for="ea-features" class="text-muted-foreground">Feature Flags</Label>
      <Input
        id="ea-features"
        v-model="featureFlagsInput"
        type="text"
        placeholder="comma-separated"
        class="w-full"
      />
    </div>
    <Button type="submit">Save</Button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { Button } from '@/shared/components/shadcn/button'
import { Input } from '@/shared/components/shadcn/input'
import Label from '@/shared/components/shadcn/Label.vue'

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const form = ref({ ...props.modelValue })
const featureFlagsInput = ref((props.modelValue.feature_flags || []).join(', '))

const handleSubmit = () => {
  form.value.feature_flags = featureFlagsInput.value.split(',').map((f) => f.trim()).filter(Boolean)
  emit('submit', form.value)
}
</script>
