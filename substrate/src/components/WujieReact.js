import { useEffect, useRef } from 'react';
import { startApp, destroyApp } from 'wujie';

export default function WujieReact(props) {

    const myRef = useRef(null)
    let destroy = null;

    const startAppFunc = async () => {
        startApp({
            ...props,
            sync: true,
            el: myRef?.current,
        })
    }

    useEffect(() => {
        startAppFunc();

        return () => {
            destroy && destroyApp(destroy)
        }
    })

    const { width, height } = props;

    return (
        <div ref={myRef} style={{
            width,
            height,
        }}></div>
    )
}