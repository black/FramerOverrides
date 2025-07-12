// SlotDemo.tsx
import { Frame, addPropertyControls, ControlType } from "framer"
import * as React from "react"

export function SlotDemo(props) {
    const { items = [], gap, direction } = props

    const layout = direction ? "row" : "column"

    return (
        <Frame
            width="100%"
            height="100%"
            background="none"
            overflow="hidden"
            style={{
                display: "flex",
                flexDirection: layout,
                gap: `${gap}px`,
            }}
        >
            {items}
        </Frame>
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
