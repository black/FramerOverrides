import { forwardRef, useEffect, type ComponentType } from "react"
import { createStore } from "https://framer.com/m/framer/store.js@^1.0.0"

// Shared store to pass selection between components
const vehicleStore = createStore({
    vehicleType: "",
})

const eatableTypes = {
    fruits: [
        "Apple",
        "Mango",
        "Guava",
        "Grapes",
        "Oranges",
        "Pineapple",
        "Kiwi",
        "Watermelon",
    ],
    vegetables: [
        "Potato",
        "Tomato",
        "Eggplants",
        "Okra",
        "Spinach",
        "Carrot",
        "Radish",
    ],
    others: [
        "Ginger",
        "Green Chilli",
        "Capsicum",
        "Coriander",
        "Basil",
        "Garlic",
    ],
}

// Parent Select override
export function getSelectValue(Component): ComponentType<any> {
    return forwardRef((props: any, ref) => {
        const [store, setStore] = vehicleStore()
        const handleChange = (event) => {
            const value = event.target.value
            console.log("Selected value:", value)
            setStore({ vehicleType: value })
            props.onChange?.(event)
        }

        return <Component {...props} ref={ref} onChange={handleChange} />
    })
}

// Child Select override
export function withChildSelect(Component): ComponentType<any> {
    return forwardRef((props: any, ref) => {
        const [store] = vehicleStore()

        const childOptions = eatableTypes[store.vehicleType] ?? []

        const selectOptions = [
            ...childOptions.map((city) => ({
                title: city,
                value: city,
                type: "option",
            })),
        ]

        return (
            <Component
                {...props}
                ref={ref}
                selectOptions={selectOptions}
                defaultValue={props.defaultValue ?? ""}
            />
        )
    })
}
