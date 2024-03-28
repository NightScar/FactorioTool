interface ItemIconProps {
    x: number;
    y: number;
}

export default function ItemIcon(props: ItemIconProps) {
    const pstr: string = props.x * -34 + 'px ' + props.y * -34 + 'px';
    // return (
    //     <div
    //         style={{
    //             background: "url('/icon/Iconsheet_32.png') no-repeat",
    //             width: '34px',
    //             height: '34px',
    //             display: 'inline-block',
    //             backgroundPosition: pstr,
    //         }}
    //     />
    // );
    return (
        <img
            style={{
                width: '34px',
                height: '34px',
            }}
            src={'/icon/item/' + props.x + '_' + props.y + '.png'}
        />
    );
}
