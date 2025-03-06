import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const editorConfiguration = {
  toolbar: [
    "heading",
    "|",
    "bold",
    "italic",
    "link",
    "|",
    "alignment",
    "bulletedList",
    "numberedList",
    "|",
    "blockQuote",
    "insertTable",
  ],
  rows: 4,
};

interface CustomCKEditorInterface {
  getData: (value: string) => void;
  data?: string;
}

const CustomCKEditor = ({ getData, data }: CustomCKEditorInterface) => {
  return (
    <CKEditor
      editor={ClassicEditor as any} // Type assertion here
      config={editorConfiguration}
      data={data}
      onChange={(_, editor) => {
        const data = editor?.getData();
        getData(data);
      }}
    />
  );
};

export default CustomCKEditor;
