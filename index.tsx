import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'https://esm.sh/react-markdown@9?bundle';
import remarkMath from 'https://esm.sh/remark-math@6?bundle';
import rehypeKatex from 'https://esm.sh/rehype-katex@7?bundle';
import remarkBreaks from 'https://esm.sh/remark-breaks@4?bundle';
import remarkGfm from 'https://esm.sh/remark-gfm@4?bundle';

// SYSTEM INSTRUCTION TUYỆT ĐỐI TUÂN THỦ YÊU CẦU CỦA BẠN
const MATH_TUTOR_INSTRUCTION = `
Bạn là TRỢ LÝ HỌC TẬP TOÁN LỚP 12.
Nhiệm vụ: Hỗ trợ học và ôn tập TOÁN 12 theo SGK CÁNH DIỀU VÀ KẾT NỐI TRI THỨC VỚI CUỘC SỐNG.

==================================================
A. QUY ĐỊNH GIAO DIỆN (QUAN TRỌNG NHẤT - BẮT BUỘC TUÂN THỦ)

NGUYÊN TẮC VÀNG: "MỖI Ý LÀ MỘT DÒNG - KHÔNG VIẾT ĐOẠN VĂN"
• Trong TẤT CẢ 5 khối nội dung, TUYỆT ĐỐI KHÔNG viết văn bản thành đoạn dài.
• BẮT BUỘC sử dụng danh sách gạch đầu dòng (bullet points) cho MỌI câu, MỌI bước biến đổi.
• Nếu một bước giải có nhiều biến đổi toán học, hãy tách mỗi biến đổi thành 1 dòng riêng.

VÍ DỤ SAI (CẤM):
Ta có phương trình $x^2 - 1 = 0$. Suy ra $(x-1)(x+1) = 0$. Do đó $x=1$ hoặc $x=-1$.

VÍ DỤ ĐÚNG (BẮT BUỘC):
• Ta có phương trình: $x^2 - 1 = 0$.
• Phân tích nhân tử: $(x-1)(x+1) = 0$.
• Suy ra: $x = 1$ hoặc $x = -1$.
• Vậy phương trình có 2 nghiệm.

==================================================
B. CẤU TRÚC 5 KHỐI BẮT BUỘC
Mọi câu trả lời bài tập phải có đủ 5 khối sau (trừ khi chỉ xin gợi ý):

1️⃣ KIẾN THỨC SỬ DỤNG
2️⃣ GỢI Ý BƯỚC GIẢI
3️⃣ LỜI GIẢI CHI TIẾT
4️⃣ CHỐT PHƯƠNG PHÁP GIẢI
5️⃣ BÀI TOÁN TƯƠNG TỰ

Mỗi khối phải có: Tiêu đề IN HOA, Icon cố định.

==================================================
C. CHI TIẾT ĐỊNH DẠNG TỪNG KHỐI

[#L12 | <TÊN BỘ SÁCH>] 📐 <TIÊU ĐỀ BÀI TOÁN>

📘 1️⃣. KIẾN THỨC SỬ DỤNG
• (Gạch đầu dòng 1) Kiến thức A...
• (Gạch đầu dòng 2) Công thức B...
• (Gạch đầu dòng 3) Định lý C...
(Mỗi kiến thức phải xuống dòng riêng biệt)

🧠 2️⃣. GỢI Ý BƯỚC GIẢI
• Bước 1: Làm gì...
• Bước 2: Tính gì...
• Bước 3: Kết luận gì...
(Tuyệt đối không viết liền)

✍️ 3️⃣. LỜI GIẢI CHI TIẾT
• Ta có: ... (xuống dòng)
• Suy ra: ... (xuống dòng)
• Tương đương: ... (xuống dòng)
• Biến đổi: ... (xuống dòng)
• Thay số: ... (xuống dòng)
• Kết quả: ... (xuống dòng)
(Đảm bảo nhìn vào thấy thoáng, từng dòng một)

✅ 4️⃣. CHỐT PHƯƠNG PHÁP GIẢI
• Bước 1: ...
• Bước 2: ...
• Lưu ý: ...

✍️ 5️⃣. BÀI TOÁN TƯƠNG TỰ
• Đề bài: ...
• (Không đưa lời giải)

==================================================
D. QUY ĐỊNH TOÁN HỌC (LATEX)
• BẮT BUỘC dùng LaTeX cho biểu thức toán.
• Dùng dấu $ cho công thức (ví dụ: $y = f(x)$).
• Dùng $$ cho công thức quan trọng muốn tách dòng.
• Khi cần lập bảng (bảng biến thiên, bảng xét dấu), hãy sử dụng Markdown Table.

==================================================
E. QUY TẮC SƯ PHẠM
• Nếu học sinh chỉ hỏi gợi ý -> Chỉ hiện khối 1 và 2.
• Nếu học sinh hỏi giải chi tiết -> Hiện đủ 5 khối.

==================================================
F. LUYỆN THI TNTHPT (CẤU TRÚC MỚI)
Khi được yêu cầu tạo đề thi TNTHPT, hãy tạo đề thi chia thành 03 phần rõ ràng:

• Phần I (12 câu): Trắc nghiệm 4 phương án (A, B, C, D), chọn 1 đáp án đúng.
• Phần II (4 câu): Trắc nghiệm Đúng/Sai. Mỗi câu gồm 4 ý (a, b, c, d), học sinh cần xác định mỗi ý là Đúng hay Sai.
• Phần III (6 câu): Trắc nghiệm trả lời ngắn (Học sinh điền kết quả số hoặc biểu thức).

YÊU CẦU QUAN TRỌNG:
• Mỗi lần tạo đề phải là một đề MỚI HOÀN TOÀN, số liệu và hàm số phải khác biệt so với các lần trước.
• Đề bài phải bao quát kiến thức Toán 12 (Giải tích, Hình học).
• Sau phần đề bài, BẮT BUỘC cung cấp LỜI GIẢI CHI TIẾT cho từng câu (Phần I, II, III).
• Trình bày lời giải rõ ràng, mạch lạc, dùng LaTeX.
`;

type Message = {
    role: "user" | "model";
    text: string;
    image?: string; // Base64 Data URL for display
};

const INITIAL_MESSAGE: Message = {
  role: "model",
  text: "👋 Chào em! Anh là **Trợ lý Toán 12**. Anh có thể giúp em ôn tập theo SGK **Cánh Diều** hoặc **Kết Nối Tri Thức**.\n\nEm hãy gửi bài toán em đang thắc mắc nhé (có thể gửi kèm ảnh đề bài)! Anh sẽ giúp em gợi ý hoặc giải chi tiết.",
};

const App = () => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, imagePreview]); 

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB.");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault(); 
          if (file.size > 5 * 1024 * 1024) {
            alert("Ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB.");
            return;
          }
          setSelectedImage(file);
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result as string);
          };
          reader.readAsDataURL(file);
          return; 
        }
      }
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const processGeminiCall = async (historyMessages: Message[]) => {
    setIsLoading(true);

    try {
        // Use process.env.API_KEY directly as required
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
        
        // Filter out the initial Greeting for the API call (index > 0)
        const apiContents = historyMessages.filter((_, index) => index > 0).map(m => {
          const parts: any[] = [];
          if (m.image) {
              const [header, base64] = m.image.split(',');
              const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';
              parts.push({ inlineData: { mimeType, data: base64 } });
          }
          if (m.text) {
              parts.push({ text: m.text });
          }
          return {
              role: m.role,
              parts: parts
          };
        });
  
        // Helper to call API with a specific model
        const callModel = async (modelName: string) => {
           return await ai.models.generateContent({
            model: modelName,
            contents: apiContents,
            config: {
                systemInstruction: MATH_TUTOR_INSTRUCTION,
                temperature: 0.6, 
            },
          });
        };

        let response;
        try {
            // First try the Pro model for best quality
            response = await callModel("gemini-3-pro-preview");
        } catch (error: any) {
            console.warn("Gemini Pro failed, attempting fallback to Flash:", error);
            // If Pro fails (e.g. 500 error), fallback to Flash which is often more stable
            response = await callModel("gemini-3-flash-preview");
        }
  
        const responseText = response?.text || "Xin lỗi, anh chưa đọc được nội dung trả lời.";
  
        setMessages((prev) => [...prev, { role: "model", text: responseText }]);
      } catch (error: any) {
        console.error("Lỗi khi gọi Gemini:", error);
        let errorMsg = "⚠️ Có lỗi xảy ra khi xử lý yêu cầu.";
        if (error.message) {
            errorMsg += ` (${error.message})`;
        }
        setMessages((prev) => [
          ...prev,
          { role: "model", text: errorMsg + "\n\nEm hãy thử lại hoặc gửi lại ảnh nhé." },
        ]);
      } finally {
        setIsLoading(false);
      }
  };

  const handleSendMessage = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;
    
    const userMessageText = input;
    const currentImagePreview = imagePreview;

    setInput("");
    setSelectedImage(null);
    setImagePreview(null);
    
    // Create new message object
    const newMessage: Message = { 
        role: "user", 
        text: userMessageText,
        image: currentImagePreview || undefined
    };

    // Update state and then trigger API
    setMessages((prev) => {
        const updated = [...prev, newMessage];
        processGeminiCall(updated);
        return updated;
    });
  };

  const handleRetry = () => {
    if (isLoading) return;
    setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        let newHistory = prev;
        
        // If last message is from model, remove it to retry the user's prompt
        if (lastMsg.role === 'model') {
            newHistory = prev.slice(0, -1);
        }
        
        // If we are back to just the greeting, nothing to retry
        if (newHistory.length <= 1) return prev;

        // Trigger API call with the trimmed history
        processGeminiCall(newHistory);
        return newHistory;
    });
  };

  const handlePracticeExam = () => {
    if (isLoading) return;
    // Generate a random ID to ensure the prompt is unique and AI generates a new exam
    const examId = Math.floor(Math.random() * 9000) + 1000;
    const practicePrompt = `Hãy tạo cho em một ĐỀ THI THỬ TNTHPT môn Toán theo cấu trúc mới (Mã đề ngẫu nhiên: #${examId}).
    
YÊU CẦU BẮT BUỘC:
1. Đề thi phải MỚI HOÀN TOÀN, thay đổi số liệu và hàm số so với các đề trước.
2. Cấu trúc chuẩn 3 phần (12 câu trắc nghiệm, 4 câu đúng sai, 6 câu trả lời ngắn).
3. Kèm lời giải chi tiết cho từng câu.`;
    
    const newMessage: Message = {
        role: "user",
        text: practicePrompt
    };

    setMessages((prev) => {
        const updated = [...prev, newMessage];
        processGeminiCall(updated);
        return updated;
    });
  };

  const handleClearChat = () => {
    // Removed confirm dialog to ensure immediate action and avoid blocking issues
    setMessages([{ ...INITIAL_MESSAGE }]); // Create a copy to ensure state reference update
    setInput("");
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white shadow-xl overflow-hidden">
      {/* Header */}
      <header className="bg-blue-600 text-white p-3 flex flex-wrap items-center justify-between shadow-md z-10 gap-2">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-2 rounded-full hidden sm:block">
            <span className="text-2xl">📐</span>
          </div>
          <div>
            <h1 className="text-lg font-bold sm:text-xl">TRỢ LÝ TOÁN 12</h1>
            <p className="text-xs text-blue-100 opacity-90 hidden sm:block">
              Cánh Diều & Kết Nối Tri Thức | Ôn thi 2026
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
            <button
                onClick={handlePracticeExam}
                disabled={isLoading}
                className="bg-white text-blue-600 px-3 py-1.5 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors flex items-center gap-1 shadow-sm disabled:opacity-50"
            >
                📝 <span className="hidden sm:inline">Luyện đề TNTHPT</span>
                <span className="sm:hidden">Luyện đề</span>
            </button>
            <button
                onClick={handleClearChat}
                disabled={isLoading}
                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors shadow-sm disabled:opacity-50"
                title="Xóa đoạn chat"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
            </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50 scrollbar-hide">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[95%] md:max-w-[85%] rounded-2xl p-4 shadow-sm border relative group ${
                msg.role === "user"
                  ? "bg-blue-600 text-white border-blue-600 rounded-br-none"
                  : "bg-white text-gray-900 border-gray-200 rounded-bl-none"
              }`}
            >
              {msg.image && (
                <div className="mb-3">
                   <img 
                    src={msg.image} 
                    alt="Uploaded content" 
                    className="max-h-64 rounded-lg border border-white/20"
                   />
                </div>
              )}
              <div className={`markdown-body overflow-x-auto ${msg.role === "user" ? "text-white" : ""}`}>
                {msg.role === "user" ? (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                ) : (
                  <ReactMarkdown 
                    remarkPlugins={[remarkMath, remarkBreaks, remarkGfm]} 
                    rehypePlugins={[rehypeKatex]}
                    components={{
                        hr: ({node, ...props}) => <hr className="my-4 border-t-2 border-gray-200" {...props} />,
                        // Add table support styling if needed, though markdown-body usually handles it
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                )}
              </div>
            </div>
            
            {/* Retry Button for the latest Model message */}
            {msg.role === "model" && index === messages.length - 1 && !isLoading && index > 0 && (
                <div className="mt-1 ml-2">
                    <button 
                        onClick={handleRetry}
                        className="text-xs text-gray-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                        title="Thử lại câu trả lời này"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        Thử lại
                    </button>
                </div>
            )}
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-gray-200 shadow-sm flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        {/* Image Preview Area */}
        {imagePreview && (
          <div className="mb-3 relative inline-block">
             <img src={imagePreview} alt="Preview" className="h-20 rounded-lg border border-gray-300" />
             <button 
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
                title="Xóa ảnh"
             >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>
          </div>
        )}

        <div className="relative flex items-end border border-gray-300 rounded-xl bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
          
          {/* File Input */}
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden" 
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="m-2 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Gửi ảnh"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="Nhập bài toán (có thể dán ảnh Ctrl+V)..."
            className="w-full bg-transparent p-3 max-h-32 min-h-[50px] outline-none resize-none text-gray-900 placeholder-gray-500"
            rows={1}
            style={{ minHeight: '50px' }}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || (!input.trim() && !selectedImage)}
            className={`m-2 p-2 rounded-lg transition-colors ${
              isLoading || (!input.trim() && !selectedImage)
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
        <div className="mt-2 text-center text-xs text-gray-400">
          Hỗ trợ LaTeX $\int$ và gửi ảnh đề bài
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);