import { cva } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-accent text-accent-foreground shadow hover:bg-accent/90 dark:hover:bg-accent/85 light:hover:text-white',
        primary: 'bg-primary text-primary-foreground shadow hover:bg-primary/90 dark:hover:bg-primary/85',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 dark:hover:bg-destructive/85',
        success: 'bg-success-900 text-white shadow-sm hover:bg-success-800 dark:bg-success dark:hover:bg-success/85 !text-white',
        warning: 'bg-warning text-warning-foreground shadow-sm hover:bg-warning/85 dark:hover:bg-warning/80 dark:hover:text-warning-foreground',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/10 light:hover:text-white',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 dark:hover:bg-secondary/70',
        ghost: 'hover:bg-accent/10 hover:text-accent-foreground text-foreground dark:hover:bg-accent/15 light:hover:text-white',
        link: 'text-primary underline-offset-4 hover:underline hover:text-primary/80',
      },
      size: {
        default: 'h-9 px-4 py-2',
        xs: 'h-7 rounded px-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)
