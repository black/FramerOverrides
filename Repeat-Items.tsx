import { forwardRef, type ComponentType } from "react"

export function withRepeatComponent(Component): ComponentType {
    return forwardRef(({ count = 3, ...props }, ref) => {
        const items = Array.from({ length: count })

        return (
            <>
                {items.map((_, index) => (
                    <Component key={index} {...props} />
                ))}
            </>
        )
    })
}
