import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { demoConversations } from '@/constants/demos';
import { Car, MessageSquare, RotateCcw, Sparkles, Send } from 'lucide-react';

export interface InputData {
  vehicleContext: string;
  conversationText: string;
}

interface InputPanelProps {
  onSubmit: (data: InputData) => void;
  loading: boolean;
}

export function InputPanel({ onSubmit, loading }: InputPanelProps) {
  const [vehicleContext, setVehicleContext] = useState('');
  const [conversationText, setConversationText] = useState('');
  const [errors, setErrors] = useState<{ vehicle?: string; conversation?: string }>({});

  const validate = useCallback((): boolean => {
    const newErrors: { vehicle?: string; conversation?: string } = {};
    if (!vehicleContext.trim()) {
      newErrors.vehicle = '请输入车辆背景信息';
    }
    if (!conversationText.trim()) {
      newErrors.conversation = '请输入销售对话内容';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [vehicleContext, conversationText]);

  const handleSubmit = useCallback(() => {
    if (validate()) {
      onSubmit({ vehicleContext: vehicleContext.trim(), conversationText: conversationText.trim() });
    }
  }, [validate, onSubmit, vehicleContext, conversationText]);

  const handleClear = useCallback(() => {
    setVehicleContext('');
    setConversationText('');
    setErrors({});
  }, []);

  const loadDemo = useCallback((index: number) => {
    const demo = demoConversations[index];
    if (demo) {
      setVehicleContext(demo.vehicle_context);
      setConversationText(demo.conversation_text);
      setErrors({});
    }
  }, []);

  const vehicleChars = vehicleContext.length;
  const conversationChars = conversationText.length;

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">输入对话</h2>
        <div className="flex gap-2">
          {demoConversations.map((demo, i) => (
            <Button
              key={demo.name}
              variant="outline"
              size="sm"
              onClick={() => loadDemo(i)}
              disabled={loading}
              className="text-xs"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              {demo.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Vehicle Context */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Car className="w-4 h-4 mr-1.5" />
            车辆背景
          </label>
          <span className={`text-xs ${vehicleChars > 500 ? 'text-red-500' : 'text-gray-400'}`}>
            {vehicleChars} 字
          </span>
        </div>
        <Textarea
          placeholder="例如：比亚迪宋PLUS DM-i 2024款，指导价15.98-18.98万，插电混动SUV..."
          value={vehicleContext}
          onChange={(e) => {
            setVehicleContext(e.target.value);
            if (errors.vehicle) setErrors((prev) => ({ ...prev, vehicle: undefined }));
          }}
          disabled={loading}
          className={`min-h-[80px] resize-none ${errors.vehicle ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        {errors.vehicle && <p className="text-xs text-red-500">{errors.vehicle}</p>}
      </div>

      {/* Conversation Text */}
      <div className="flex-1 space-y-2 min-h-0">
        <div className="flex items-center justify-between">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <MessageSquare className="w-4 h-4 mr-1.5" />
            销售对话
          </label>
          <span className={`text-xs ${conversationChars > 10000 ? 'text-red-500' : 'text-gray-400'}`}>
            {conversationChars} 字
          </span>
        </div>
        <Textarea
          placeholder="粘贴销售与客户的对话记录，支持多轮对话..."
          value={conversationText}
          onChange={(e) => {
            setConversationText(e.target.value);
            if (errors.conversation) setErrors((prev) => ({ ...prev, conversation: undefined }));
          }}
          disabled={loading}
          className={`h-full min-h-[300px] resize-none ${errors.conversation ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        {errors.conversation && <p className="text-xs text-red-500">{errors.conversation}</p>}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
              分析中...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              开始复盘
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={handleClear}
          disabled={loading}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          清空
        </Button>
      </div>
    </div>
  );
}
