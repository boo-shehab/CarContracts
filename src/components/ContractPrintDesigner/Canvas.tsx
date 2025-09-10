/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { Rnd } from 'react-rnd';
import Toolbar from './Toolbar';
import { Field, InputItem, ItemTypes } from './types';
import axios from '../../services/axios';
import { toast } from 'react-toastify';

interface CanvasProps {
  availableFields: Field[];
  setAvailableFields: React.Dispatch<React.SetStateAction<Field[]>>;
}

const Canvas = ({ setAvailableFields }: CanvasProps) => {
  const [items, setItems] = useState<InputItem[]>([]);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const [, drop] = useDrop(() => ({
    accept: ItemTypes.INPUT,
    drop: (item: Field, monitor) => {
      const offset = monitor.getClientOffset();
      const container = document.getElementById('canvas-container')?.getBoundingClientRect();
      if (!offset || !container) return;

      const x = offset.x - container.left;
      const y = offset.y - container.top;

      if (x >= 0 && y >= 0 && x <= container.width && y <= container.height) {
        setItems((prev) => [
          ...prev,
          { fieldId: item.id, label: item.label, x, y, width: 200, height: 40 }
        ]);
        setAvailableFields((prev) => prev.filter((f) => f.id !== item.id));
      }
    },
  }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setBgImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // const handlePrint = () => window.print();
  const handleSave = async () => {
  try {
    let templateId = data?.id;

    // Map fields (data only)
    const fieldsPayload = items.map((item) => ({
      fieldId: item.fieldId,
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height,
      label: item.label,
    }));

    // ---------- STEP 1: Save or update data ----------
    if (!templateId) {
      // Create new template without image first
      const res = await axios.post('/templates', {
        name: 'Contract Template',
        fields: fieldsPayload,
      });
      templateId = res.data.data.id;

      setData(res.data.data);
      setBgImage(res.data.data.imageKey);
      setItems(res.data.data.fields);

    } else {
      // Update existing template data
      await axios.put(`/templates/${templateId}`, {
        name: 'Contract Template',
        fields: fieldsPayload,
      });
    }

    // ---------- STEP 2: If bgImage changed, upload separately ----------
    if (bgImage && bgImage.startsWith('data:')) {
      // convert base64 → blob
      const blob = await fetch(bgImage).then((res) => res.blob());
      const formData = new FormData();
      formData.append('image', blob, 'background.png');

      await axios.post(`/templates/${templateId}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

    }

    toast.success('تم الحفظ بنجاح');
  } catch (err) {
    console.error(err);
    toast.error('فشل الحفظ');
  }
};


  const handleDeleteAll = async () => {
    if (!data?.id) {
      // ماكو داتا محفوظة بالباكند
      setBgImage(null);
      setAvailableFields((prev) => [
        ...prev,
        ...items.map((i) => ({ id: i.fieldId, label: i.label }))
      ]);
      setItems([]);
      return;
    }

    try {
      await axios.delete(`/templates/${data.id}`);
      setBgImage(null);
      setAvailableFields((prev) => [
        ...prev,
        ...items.map((i) => ({ id: i.fieldId, label: i.label }))
      ]);
      setItems([]);
      setData(null);
      toast.success('تم الحذف بنجاح');
    } catch (error) {
      console.error(error);
      toast.error('فشل الحذف من الباكند');
    }
  };



  // const handleClear = () => {
  //   localStorage.clear();
  //   setBgImage(null);
  //   setItems([]);
  //   setAvailableFields((prev) => [...prev, ...items.map((i) => ({ id: i.id, label: i.label }))]);
  // };

  useEffect(() => {
    const getSavedData = async () => {
      // const savedBg = localStorage.getItem('contractBg');
      // const savedInputs = localStorage.getItem('contractInputs');

      const response = await axios.get('/templates/company');
      const savedBg = response.data.data[response.data.data.length - 1]?.imageKey;
      const savedInputs = response.data.data[response.data.data.length - 1]?.fields || [];
      setData(response.data.data[response.data.data.length - 1]);
      
  
      if (savedBg) setBgImage(savedBg);
  
      if (savedInputs) {
        try {
          setItems(savedInputs);
  
          // Remove loaded items from the sidebar
          setAvailableFields((prev) =>
            prev.filter((field) => !savedInputs.some((item: any) => item.fieldId === field.id))
          );
        } catch (e) {
          console.error('Failed to parse saved inputs:', e);
        }
      }
    }
    getSavedData();
  }, []);

  return (
    <div className="flex-1 p-4 overflow-auto">
      <Toolbar
        onSave={handleSave}
        onClearImage={() => setBgImage(null)}
        onClearFields={() => {
          setAvailableFields((prev) => [
            ...prev,
            ...items.map((i) => ({ id: i.fieldId, label: i.label }))
          ]);
          setItems([]);
        }}
        onDeleteAll={handleDeleteAll}
      />


      <div
        id="canvas-container"
        ref={(node) => {
          if (node) drop(node);
        }}
        className="relative w-[794px] h-[1123px] mx-auto border border-gray-300 bg-white"
      >
        {bgImage? (
          <img
            src={bgImage}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ): (
          <div
    onDrop={(e) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => setBgImage(reader.result as string);
        reader.readAsDataURL(file);
      }
    }}
    onDragOver={(e) => e.preventDefault()}
    className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg bg-gray-50 text-gray-600 cursor-pointer hover:bg-gray-100 transition"
    onClick={() => document.getElementById("bg-file-input")?.click()}
  >
    <p className="text-lg font-medium mb-2">📂 Drag & Drop an image here</p>
    <p className="text-sm text-gray-500">or click to select a file</p>
    <input
      id="bg-file-input"
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      className="hidden"
    />
  </div>
        )}

        {items.map((item) => (
          <Rnd
            key={item.fieldId}
            size={{ width: item.width, height: item.height }}
            position={{ x: item.x, y: item.y }}
            onDragStop={(_e, d) => {
              const container = document
                .getElementById('canvas-container')
                ?.getBoundingClientRect();
              if (!container) return;

              // Outside canvas → remove and return to sidebar
              if (
                d.x + item.width < 0 ||
                d.y + item.height < 0 ||
                d.x > container.width ||
                d.y > container.height
              ) {
                setItems((prev) => prev.filter((i) => i.fieldId !== item.fieldId));
                setAvailableFields((prev) => [...prev, { id: item.fieldId, label: item.label }]);
              } else {
                // Update position inside canvas
                setItems((prev) =>
                  prev.map((i) => (i.fieldId === item.fieldId ? { ...i, x: d.x, y: d.y } : i))
                );
              }
            }}
            onResizeStop={(_e, _dir, ref, _delta, pos) => {
              setItems((prev) =>
                prev.map((i) =>
                  i.fieldId === item.fieldId
                    ? {
                        ...i,
                        width: ref.offsetWidth,
                        height: ref.offsetHeight,
                        x: pos.x,
                        y: pos.y,
                      }
                    : i
                )
              );
            }}
          >
            <input
              className="w-full h-full p-2 border border-gray-500 bg-transparent text-sm"
              placeholder={item.label}
              readOnly
            />
          </Rnd>
        ))}
      </div>
    </div>
  );
};

export default Canvas;
