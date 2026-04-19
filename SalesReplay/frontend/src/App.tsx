import { useEffect, useRef, useState } from 'react';
import { InputPanel } from '@/components/InputPanel';
import { ReviewPanel } from '@/components/ReviewPanel';
import { ApiKeySetting } from '@/components/ApiKeySetting';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Toast } from '@/components/Toast';
import { useSalesReview } from '@/hooks/useSalesReview';

function AppContent() {
  const { data: review, loading, error, submit } = useSalesReview();
  const reviewRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Auto-scroll to top when review arrives
  useEffect(() => {
    if (review && reviewRef.current) {
      reviewRef.current.scrollTop = 0;
    }
  }, [review]);

  // Show error toast
  useEffect(() => {
    if (error) {
      setToast({ message: error, type: 'error' });
    }
  }, [error]);

  const handleSubmit = (data: { vehicleContext: string; conversationText: string }) => {
    setToast(null);
    submit(data.vehicleContext, data.conversationText);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">SalesReplay</h1>
            <p className="text-sm text-gray-500">AI 销售对话复盘工具</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-gray-400">
              Ctrl + Enter 提交
            </div>
            <ApiKeySetting />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-6 overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-[calc(100vh-100px)]">
          {/* Left Panel - Input */}
          <div className="w-full lg:w-[42%] bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col">
            <InputPanel onSubmit={handleSubmit} loading={loading} />
          </div>

          {/* Right Panel - Output */}
          <div ref={reviewRef} className="w-full lg:w-[58%] bg-white rounded-xl border border-gray-200 p-4 shadow-sm overflow-auto">
            <ErrorBoundary>
              <ReviewPanel review={review} loading={loading} />
            </ErrorBoundary>
          </div>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

export default App;
