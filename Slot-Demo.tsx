// SlotDemo.tsx
import { Stack, addPropertyControls, ControlType } from "framer"
import * as React from "react"

export function SlotDemo(props) {
    const { items = [], gap, direction } = props

    const layout = direction ? "row" : "column"

    return (
        <Stack width="100%" height="100%" gap={gap} direction={layout}>
            {items}
        </Stack>
    )
}

addPropertyControls(SlotDemo, {
    items: {
        type: ControlType.Array,
        title: "Items",
        propertyControl: {
            type: ControlType.ComponentInstance,
        },
    },
    gap: {
        title: "Gap",
        type: ControlType.Number,
        defaultValue: 16,
        min: 0,
        max: 100,
    },
    direction: {
        title: "Align",
        type: ControlType.Boolean,
        defaultValue: true,
        enabledTitle: "Horizontal",
        disabledTitle: "Vertical",
    },
})
