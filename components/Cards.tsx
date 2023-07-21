import type { ComponentChildren } from "preact";

export interface CreateAccountCardProps {
    children: ComponentChildren,
    selected: number,
    id: number,
    setSelected: (to: number) => void
}

export function CardOutline(props: CreateAccountCardProps) {

    function clickedCard() {
        if (props.selected === props.id) {
            props.setSelected(0)
        } else {
            props.setSelected(props.id)
        }
    }

    function isSelected() {
        if (props.selected === props.id) {
            return "border border-8 ring-2 ring-indigo-500"
        } else {
            return "border"
        }
    }

    return <div onClick={clickedCard} class={`${isSelected()} select-none bg-white cursor-pointer h-36 w-36 rounded-lg mr-1`}>
        {props.children}
    </div>
}