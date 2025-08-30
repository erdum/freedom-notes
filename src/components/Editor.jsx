import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { parseMarkdown } from '../markdown';
import { Trash2 } from 'lucide-react';

function Editor() {
  const isPreview = useStore((state) => state.isPreview);
  const selectedNote = useStore((state) => state.selectedNote);
  const tempContent = useStore((state) => state.tempContent);
  const marked = useStore((state) => state.marked);
  const updateNote = useStore((state) => state.updateNote);
  const setTempContent = useStore((state) => state.setTempContent);
  const setTempImages = useStore((state) => state.setTempImages);

  const [images, setImages] = useState([]);
  const [previewImg, setPreviewImg] = useState(null);

  useEffect(() => {
    console.log(selectedNote);
    setImages(selectedNote?.images ?? []);
  }, [selectedNote]);

  useEffect(() => {

    if (selectedNote?.id) {
      updateNote(selectedNote.id, { images });
    } else {
      setTempImages(images);
    }
  }, [images]);

  const pasteHanlder = (e) => {
    e.preventDefault();

    for (const clipboardItem of e.clipboardData.files) {
      if (clipboardItem.type.startsWith('image/')) {
        setImages((prevImages) => [...prevImages, clipboardItem]);
      }
    }
  };

  const dragOverHandler = (e) => {
    e.preventDefault();
  };

  const dropHandler = (ev) => {
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      [...ev.dataTransfer.items].forEach((item, i) => {
        if (item.kind === "file") {
          const file = item.getAsFile();

          if (file.type.startsWith('image/')) {
            setImages((prevImages) => [...prevImages, file]);
          }
        }
      });
    } else {
      [...ev.dataTransfer.files].forEach((file, i) => {
        if (file.type.startsWith('image/')) {
          setImages((prevImages) => [...prevImages, file]);
        }
      });
    }
  };

  const removeImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  return (
    <>
      {/* Images Bar */}
      <div className="w-full flex items-center flex-wrap">
        {images.map((img, i) => {
          const url = URL.createObjectURL(img);

          return (
            <div key={i} className="relative">
              <img
                className="aspect-square w-36 object-contain transition"
                src={url}
                onClick={() => setPreviewImg(url)}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(i);
                }}
                className="absolute top-2 right-2 p-1 hover:bg-red-100 rounded cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex-1 flex">
        {/* Editor */}
        <div className={`${isPreview ? 'w-0 md:w-1/2' : 'w-full'} transition-all flex flex-col`}>
          <textarea
            onPaste={pasteHanlder}
            onDragOver={dragOverHandler}
            onDrop={dropHandler}
            tabIndex={0}
            value={selectedNote.content ?? tempContent}
            onChange={(e) => {
              if (selectedNote?.id) {
                updateNote(selectedNote.id, { content: e.target.value });
              } else {
                setTempContent(e.target.value);
              }
            }}
            placeholder="Start writing your note..."
            className="flex-1 p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed"
          />
        </div>

        {/* Live Preview */}
        {isPreview && (
          <div className="w-full md:w-1/2 border-l border-gray-200 bg-white">
            <div className="p-6 overflow-y-auto h-full">
              {marked ? (
                <div 
                  className="prose prose-sm max-w-none leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: parseMarkdown(selectedNote.content)
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2 mx-auto"></div>
                    <p>Loading markdown parser...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {previewImg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setPreviewImg(null)}
        >
          <img
            src={previewImg}
            alt="preview"
            className="max-h-[90%] max-w-[90%] rounded-xl shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 text-white text-2xl cursor-pointer"
            onClick={() => setPreviewImg(null)}
          >
            ✕
          </button>
        </div>
      )}

    </>
  );
}

export default Editor;