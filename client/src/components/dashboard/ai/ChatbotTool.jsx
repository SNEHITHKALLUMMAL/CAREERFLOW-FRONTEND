import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Send } from 'lucide-react';
import { useChatbot } from '@/hooks/useAI';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/cn';

export function ChatbotTool() {
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const mutation = useChatbot();
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async ({ message }) => {
    if (!message.trim()) return;
    setMessages((prev) => [...prev, { sender: 'user', content: message }]);
    reset();

    const result = await mutation.mutateAsync({ message, chatId });
    setChatId(result.chatId);
    setMessages((prev) => [...prev, { sender: 'assistant', content: result.reply }]);
  };

  return (
    <Card>
      <CardTitle>Career chatbot</CardTitle>
      <CardDescription>Ask anything about your career, skills, or next steps.</CardDescription>

      <div className="mt-4 flex h-72 flex-col gap-2 overflow-y-auto rounded-xl border border-mist/15 p-3 dark:border-white/10">
        {messages.length === 0 && (
          <p className="m-auto text-sm text-mist">Start the conversation below.</p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              'max-w-[85%] rounded-xl px-3 py-2 text-sm',
              m.sender === 'user'
                ? 'ml-auto bg-signal text-white'
                : 'bg-mist/10 text-ink dark:text-white'
            )}
          >
            {m.content}
          </div>
        ))}
        {mutation.isPending && <p className="text-sm text-mist">Typing...</p>}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-3 flex gap-2" noValidate>
        <Input placeholder="Ask a question..." {...register('message', { required: true })} />
        <Button type="submit" size="md" disabled={mutation.isPending} aria-label="Send message">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
}
