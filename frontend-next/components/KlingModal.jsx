import React, { useState, useEffect } from 'react';
import { X, Video, Sparkles, Download } from 'lucide-react';
import { convertScriptToKling } from '../utils/mapToKling';

const KlingModal = ({ isOpen, onClose, scriptJson }) => {
  const [showKlingModal, setShowKlingModal] = useState(false);
  const [klingRequest, setKlingRequest] = useState(null);

  const handleExport = () => {
    if (!scriptJson || !scriptJson.segments || scriptJson.segments.length === 0) {
      alert('请先导出 JSON 才能生成 Kling 视频');
      return;
    }

    // 转换为 Kling multi-shot 请求体
    try {
      const request = convertScriptToKling(scriptJson);
      setKlingRequest(request);
      setShowKlingModal(false); // 关闭并显示成功提示
      console.log('Kling JSON:', JSON.stringify(request, null, 2));
    } catch (error) {
      console.error('Kling 转换失败:', error);
      alert('Kling 请求生成失败：' + error.message);
    }
  };

  const handleClose = () => {
    setKlingRequest(null);
    setShowKlingModal(false);
  };

  const downloadKling = () => {
    if (!klingRequest) {
      alert('请先生成 Kling 请求！');
      return;
    }
    const blob = new Blob([JSON.stringify(klingRequest, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kling_${Date.now()}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border-[#EFF6FF] flex flex-col">
        <button onClick={handleClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 z-10 bg-white/80 rounded-full hover:bg-gray-100 transition-colors">
          <X size={24} />
        </button>

        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] rounded-full flex items-center justify-center mb-6 shadow-sm">
            <Video size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-black">Kling 视频生成</h2>
          <p className="text-sm text-gray-500">脚本已转换为 Kling multi-shot 请求格式</p>
        </div>

        <div className="p-8 overflow-y-auto">
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-sm font-bold text-gray-600 mb-4">预览 Kling 请求 JSON</p>
            <pre className="text-xs bg-white p-4 rounded-xl text-left overflow-auto">
              {klingRequest ? JSON.stringify(klingRequest, null, 2) : '暂无数据'}
            </pre>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <button
              onClick={handleClose}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-gray-600 transition-colors"
            >
              暂不导出
            </button>
            <div className="flex gap-3">
              <button
                 onClick={handleClose}
                 className="flex-1 py-3 px-6 bg-[#3B82F6] text-white rounded-xl font-bold hover:bg-[#2563EB] shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                 确认导出
              </button>
              <button
                 onClick={downloadKling}
                 className="flex-1 py-3 px-6 bg-[#8B5CF6] text-white rounded-xl font-bold hover:bg-[#7C3AED] shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                 <Download size={18} />
                 下载 JSON
              </button>
            </div>
          </div>
      </div>
    </div>
  );
};

export default KlingModal;
