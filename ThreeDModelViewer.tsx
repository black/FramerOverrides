import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function ThreeDModelViewer(props) {
    const {
        objFile,
        allowHorizontal,
        allowVertical,
        allowZoom,
        zoom,
        positionX,
        positionY,
        positionZ,
        backgroundColor,
    } = props

    const containerRef = useRef(null)
    const modelGroupRef = useRef(null)
    const animationRef = useRef(null)

    useEffect(() => {
        if (!containerRef.current || !objFile) return

        const container = containerRef.current
        const width = container.clientWidth
        const height = container.clientHeight

        const scene = new THREE.Scene()
        scene.background = new THREE.Color(backgroundColor)

        const camera = new THREE.PerspectiveCamera(
            45,
            width / height,
            0.1,
            1000
        )
        camera.position.set(positionX, positionY, positionZ)
        camera.zoom = zoom
        camera.updateProjectionMatrix()

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(width, height)
        container.appendChild(renderer.domElement)

        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableZoom = allowZoom
        controls.enablePan = false
        controls.enableRotate = allowHorizontal || allowVertical
        if (!allowHorizontal)
            controls.minAzimuthAngle = controls.maxAzimuthAngle = 0
        if (!allowVertical)
            controls.minPolarAngle = controls.maxPolarAngle = Math.PI / 2

        // ✅ Default lighting
        const ambient = new THREE.AmbientLight(0xffffff, 0.6)
        scene.add(ambient)

        const directional = new THREE.DirectionalLight(0xffffff, 0.8)
        directional.position.set(5, 10, 7.5)
        directional.castShadow = true
        scene.add(directional)

        const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4)
        hemi.position.set(0, 20, 0)
        scene.add(hemi)

        const loadModel = async () => {
            const { OBJLoader } = await import(
                "https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/loaders/OBJLoader.min.js"
            )
            const loader = new OBJLoader()

            loader.load(
                objFile,
                (object) => {
                    const group = new THREE.Group()
                    group.add(object)

                    // Fit to view
                    const box = new THREE.Box3().setFromObject(group)
                    const center = box.getCenter(new THREE.Vector3())
                    const size = box.getSize(new THREE.Vector3())
                    const maxDim = Math.max(size.x, size.y, size.z)

                    // Move model to origin
                    group.position.sub(center)
                    scene.add(group)
                    modelGroupRef.current = group

                    // Position camera to fit model
                    const fitOffset = 1.5
                    const fitDist =
                        (maxDim /
                            (2 * Math.tan((Math.PI * camera.fov) / 360))) *
                        fitOffset
                    const direction = new THREE.Vector3(
                        0,
                        0,
                        1
                    ).applyQuaternion(camera.quaternion)
                    camera.position.copy(
                        center.clone().add(direction.multiplyScalar(fitDist))
                    )
                    camera.lookAt(0, 0, 0)
                    controls.target.set(0, 0, 0)
                    camera.updateProjectionMatrix()
                },
                undefined,
                (err) => console.error("Error loading OBJ:", err)
            )
        }

        loadModel()

        const animate = () => {
            animationRef.current = requestAnimationFrame(animate)
            controls.update()
            renderer.render(scene, camera)
        }
        animate()

        return () => {
            cancelAnimationFrame(animationRef.current)
            renderer.dispose()
            if (modelGroupRef.current) {
                modelGroupRef.current.traverse((obj) => {
                    if (obj.geometry) obj.geometry.dispose()
                    if (obj.material) {
                        if (Array.isArray(obj.material))
                            obj.material.forEach((m) => m.dispose())
                        else obj.material.dispose()
                    }
                })
                scene.remove(modelGroupRef.current)
            }
            while (container.firstChild)
                container.removeChild(container.firstChild)
        }
    }, [
        objFile,
        allowHorizontal,
        allowVertical,
        allowZoom,
        zoom,
        positionX,
        positionY,
        positionZ,
        backgroundColor,
    ])

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "100%",
                position: "relative",
                overflow: "hidden",
            }}
        />
    )
}

addPropertyControls(ThreeDModelViewer, {
    objFile: {
        type: ControlType.File,
        allowedFileTypes: ["obj"],
        title: "OBJ Model",
    },
    allowHorizontal: {
        type: ControlType.Boolean,
        title: "Rotation Horz",
        defaultValue: true,
    },
    allowVertical: {
        type: ControlType.Boolean,
        title: "Rotation Vert",
        defaultValue: true,
    },
    allowZoom: {
        type: ControlType.Boolean,
        title: "Allow Zoom",
        defaultValue: true,
    },
    zoom: {
        type: ControlType.Number,
        title: "Zoom",
        defaultValue: 1,
        min: 0.1,
        max: 5,
        step: 0.1,
    },
    positionX: {
        type: ControlType.Number,
        title: "Camera X",
        defaultValue: 0,
    },
    positionY: {
        type: ControlType.Number,
        title: "Camera Y",
        defaultValue: 1,
    },
    positionZ: {
        type: ControlType.Number,
        title: "Camera Z",
        defaultValue: 3,
    },
    backgroundColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#ffffff",
    },
})
