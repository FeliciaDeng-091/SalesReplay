import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getApiKey, setApiKey, removeApiKey } from '@/utils/api';
import { Key, X, Check } from 'lucide-react';

export function ApiKeySetting() {
  const [isOpen, setIsOpen] = useState(false);
  const [key, setKey] = useState(getApiKey() || '');
  const [saved, setSaved] = useState(false);

  const handleSave = useCallback(() => {
    if (key.trim()) {
      setApiKey(key.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }, [key]);

  const handleClear = useCallback(() => {
    removeApiKey();
    setKey('');
    setSaved(false);
  }, []);

  const hasKey = !!getApiKey();

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={`${hasKey ? 'text-green-600' : 'text-gray-500'}`}
      >
        <Key className="w-4 h-4 mr-1" />
        {hasKey ? '已设置' : 'API Key'}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">MiniMax API Key</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-gray-500 mb-3">
            API Key 仅存储在浏览器本地，不会上传到服务器。
            <a
              href="https://api.minimaxi.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline"
            >
              获取 API Key
            </a>
          </p>

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="sk-..."
              value={key}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKey(e.target.value)}
              className="text-sm"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} className="flex-1">
                {saved ? <Check className="w-4 h-4 mr-1" /> : null}
                {saved ? '已保存' : '保存'}
              </Button>
              {hasKey && (
                <Button size="sm" variant="outline" onClick={handleClear}>
                  清除
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
