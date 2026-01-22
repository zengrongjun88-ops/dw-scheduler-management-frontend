import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';

/**
 * 代码编辑器属性
 */
interface CodeEditorProps {
  value: string;
  language: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: number | string;
  theme?: 'vs' | 'vs-dark' | 'hc-black';
  options?: monaco.editor.IStandaloneEditorConstructionOptions;
}

/**
 * Monaco 代码编辑器组件
 */
const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  language,
  onChange,
  readOnly = false,
  height = 400,
  theme = 'vs',
  options = {},
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      // 创建编辑器实例
      monacoEditorRef.current = monaco.editor.create(editorRef.current, {
        value,
        language,
        theme,
        readOnly,
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        ...options,
      });

      // 监听内容变化
      if (onChange) {
        monacoEditorRef.current.onDidChangeModelContent(() => {
          const currentValue = monacoEditorRef.current?.getValue() || '';
          onChange(currentValue);
        });
      }

      return () => {
        monacoEditorRef.current?.dispose();
      };
    }
  }, []);

  // 更新编辑器内容
  useEffect(() => {
    if (monacoEditorRef.current) {
      const currentValue = monacoEditorRef.current.getValue();
      if (currentValue !== value) {
        monacoEditorRef.current.setValue(value);
      }
    }
  }, [value]);

  // 更新语言
  useEffect(() => {
    if (monacoEditorRef.current) {
      const model = monacoEditorRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, language);
      }
    }
  }, [language]);

  // 更新主题
  useEffect(() => {
    monaco.editor.setTheme(theme);
  }, [theme]);

  // 更新只读状态
  useEffect(() => {
    if (monacoEditorRef.current) {
      monacoEditorRef.current.updateOptions({ readOnly });
    }
  }, [readOnly]);

  return <div ref={editorRef} style={{ height, width: '100%' }} />;
};

export default CodeEditor;
