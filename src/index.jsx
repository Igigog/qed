import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useRete } from './rete';

function Editor() {
    const [setContainer, editorRef] = useRete();

    return (
        <div>
            <input type={'text'} id={'importJson'} />
            <button
                onClick={() => {
                    editorRef.current.fromJSON(
                        JSON.parse(document.getElementById('importJson').value)
                    );
                    document.getElementById('importJson').value = '';
                }}
            >
                Import
            </button>

            <button
                onClick={() => {
                    navigator.clipboard.writeText(
                        JSON.stringify(editorRef.current.toJSON())
                    );
                }}
            >
                Export to clipboard
            </button>

            <div
                style={{
                    width: '100vw',
                    height: '100vh'
                }}
                ref={(ref) => ref && setContainer(ref)}
            />
        </div>
    );
}

function App() {
    return (
        <div
            className="App"
            style={{
                fontFamily: 'sans-serif',
                textAlign: 'center'
            }}
        >
            <Editor />
        </div>
    );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
