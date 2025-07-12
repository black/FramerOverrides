import {
    addPropertyControls,
    PropertyControls,
    ControlType,
    Frame,
} from "framer"

// roi progressbar
export function ProgressBar(props) {
    const { progress, gap, direction } = props
    const layout = direction ? "column-reverse" : "row-reverse"
    return (
        <Frame
            width="100%"
            height="100%"
            background="transparent"
            overflow="hidden"
            style={{
                display: "flex",
                flexDirection: layout,
                justifyContent: "flex-start",
            }}
        >
            <Frame
                width="100%"
                height={`${progress}%`}
                background={props.barColor}
                radius="8px"
                textSize="2rem"
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
            >
                {progress}
            </Frame>
        </Frame>
    )
}

// Only one exposed prop: barColor
addPropertyControls(ProgressBar, {
    barColor: {
        type: ControlType.Color,
        title: "ROI",
        defaultValue: "#0F62FE",
        variable: true,
    },
    progress: {
        type: ControlType.Number,
        title: "Progress",
        defaultValue: 10,
        min: 0,
        max: 100,
        variable: true,
    },
    direction: {
        title: "Align",
        type: ControlType.Boolean,
        defaultValue: true,
        enabledTitle: "Horizontal",
        disabledTitle: "Vertical",
        variable: true,
    },
})
