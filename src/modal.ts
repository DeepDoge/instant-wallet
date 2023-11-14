import { awaited, css, customTag, derive, match, populate, sheet, signal, tags } from "master-ts";
import { ChainInfo, ConnectionMethod, connect } from "./wallet";

const { dialog, div, ul, li, button } = tags;

const modalTag = customTag("zw-modal");
export function Modal(methods: ConnectionMethod[], chains: ChainInfo[]) {
    const root = modalTag();
    const dom = root.attachShadow({ mode: "open" });
    dom.adoptedStyleSheets.push(styleSheet);

    function onClick(event: MouseEvent & { target: HTMLDialogElement }) {
        const rect = event.target.getBoundingClientRect();
        if (
            rect.left > event.clientX ||
            rect.right < event.clientX ||
            rect.top > event.clientY ||
            rect.bottom < event.clientY
        ) {
            root.remove();
        }
    }

    const currentMethod = signal<ConnectionMethod | null>(null);
    const currentConnection = derive(() =>
        currentMethod.ref ? awaited(connect(currentMethod.ref)).ref?.ref ?? null : null,
    );
    const currentSigner = derive(() => currentConnection.ref?.signers.ref[0] ?? null);

    const connectionDialog = dialog({ "on:click": onClick }, [
        match(currentSigner)
            .case(null, () => null)
            .default((currentSigner) => [div([awaited(() => currentSigner.ref.getAddress())])]),
        ul([
            methods.map((method) =>
                li([button({ "on:click": () => (currentMethod.ref = method) }, [method.icon(), method.name])]),
            ),
        ]),
    ]);

    populate(dom, [connectionDialog]);

    return root;
}

const styleSheet = sheet(css`
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    :host {
    }
`);
