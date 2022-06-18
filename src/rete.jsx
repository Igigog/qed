import React, { useState, useEffect, useCallback, useRef } from 'react';
import Rete from 'rete';
import ReactRenderPlugin from 'rete-react-render-plugin';
import ConnectionPlugin from 'rete-connection-plugin';
import AreaPlugin from 'rete-area-plugin';
import ContextMenuPlugin from 'rete-context-menu-plugin';
import ConnectionReroutePlugin from 'rete-connection-reroute-plugin';
import commentPluginCommon from 'rete-comment-plugin';

const tokenSocket = new Rete.Socket('Token');

class ActionNode extends Rete.Component {
    constructor() {
        super('Action');
    }

    builder(node) {
        return node
            .addInput(new Rete.Input('token', 'Token', tokenSocket, true))
            .addOutput(new Rete.Output('token', 'Token', tokenSocket, true));
    }
}

class StartNode extends Rete.Component {
    constructor() {
        super('Start');
    }

    builder(node) {
        return node.addOutput(
            new Rete.Output('token', 'Token', tokenSocket, false)
        );
    }
}

class EndNode extends Rete.Component {
    constructor() {
        super('End');
    }

    builder(node) {
        return node.addInput(
            new Rete.Input('token', 'Token', tokenSocket, true)
        );
    }
}

function createEditor(container) {
    var components = [new ActionNode(), new StartNode(), new EndNode()];

    var editor = new Rete.NodeEditor('demo@0.1.0', container);
    editor.use(ConnectionPlugin);
    editor.use(ReactRenderPlugin);
    editor.use(ContextMenuPlugin);
    editor.use(ConnectionReroutePlugin);
    editor.use(commentPluginCommon);

    var engine = new Rete.Engine('demo@0.1.0');

    components.map((c) => {
        editor.register(c);
        engine.register(c);
    });

    editor.on(
        'process nodecreated noderemoved connectioncreated connectionremoved',
        async () => {
            console.log('process');
            await engine.abort();
            await engine.process(editor.toJSON());
        }
    );

    editor.view.resize();
    editor.trigger('process');
    AreaPlugin.zoomAt(editor, editor.nodes);

    return editor;
}

export function useRete() {
    const [container, setContainer] = useState(null);
    const editorRef = useRef();

    useEffect(() => {
        if (container) {
            editorRef.current = createEditor(container);
        }
        return () => {
            if (editorRef.current) {
                editorRef.current.destroy();
            }
        };
    }, [container]);

    return [setContainer, editorRef];
}
