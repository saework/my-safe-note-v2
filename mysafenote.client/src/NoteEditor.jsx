import React, { useState, useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';

var y = `<p>qqq</p>`;

const NoteEditor = ({ placeholder }) => {
	const editor = useRef(null);
	const [content, setContent] = useState(y);

	// const config = useMemo(
	// 	{
	// 		readonly: false, // all options from https://xdsoft.net/jodit/docs/,
	// 		placeholder: placeholder || 'Start typings...'
	// 	},
	// 	[placeholder]
	// );

	// const config = 
	// {
	// 	readonly: false, 
	// 	placeholder:  'Start typings...',
	// 	i18n: 'ru'
	// }

	const config = {
        buttons: ['bold', 'italic', 'underline','font','fontsize', 'brush', 'paragraph', '|','image','undo','redo', 'print'],
        uploader: { insertImageAsBase64URI: true },
        readonly: false,
        toolbarAdaptive: false,
		language: "ru",
      	i18n: 'ru'
    }

	const handleSave = () => {
		console.log(content);
	  };

	return (
		<div>
		<JoditEditor
			ref={editor}
			value={content}
			config={config}
			tabIndex={1} // tabIndex of textarea
			onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
			onChange={newContent => {}}
		/>
		<button onClick={handleSave}>Save</button>
		</div>
	);
};
export default NoteEditor;