import React, { useMemo, useState } from 'react';

type QuizItem = {
    id: number;
    category: string;
    title: string;
    question: string;
    answer: boolean;
    explanation: string;
};

export function Quiz() {
    const params = useMemo(() => new URLSearchParams(window.location.search), []);

    const landmarkId = params.get('id');
    const landmarkName = params.get('name') || '문화재';
    const region = params.get('region') || '지역 정보 없음';

    const quiz = useMemo<QuizItem>(() => {
        if (landmarkName.includes('수원화성')) {
            return {
                id: 1,
                category: `${region} / 문화재 퀴즈 / ${landmarkName}`,
                title: '수원화성은 조선시대에 축조된 대표적인 성곽 문화유산이다.',
                question: 'O',
                answer: true,
                explanation:
                    '수원화성은 정조 시대에 축조된 조선 후기의 대표적 성곽 문화유산으로, 역사적·건축학적 가치가 높습니다.',
            };
        }

        if (landmarkName.includes('남산서울타워')) {
            return {
                id: 1,
                category: `${region} / 랜드마크 퀴즈 / ${landmarkName}`,
                title: '남산서울타워는 서울의 대표적인 전망 명소 중 하나이다.',
                question: 'O',
                answer: true,
                explanation:
                    '남산서울타워는 서울의 상징적인 랜드마크 중 하나로, 도심 전경을 한눈에 볼 수 있는 대표적인 전망 명소입니다.',
            };
        }

        return {
            id: 1,
            category: `${region} / 문화재 퀴즈 / ${landmarkName}`,
            title: `${landmarkName}는 해당 지역과 관련된 대표 문화유산 또는 명소로 볼 수 있다.`,
            question: 'O',
            answer: true,
            explanation:
                `${landmarkName}는 지역의 역사·문화 맥락에서 중요한 의미를 가지는 장소로 볼 수 있습니다.`,
        };
    }, [landmarkName, region]);

    const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const isCorrect = submitted && selectedAnswer === quiz.answer;

    const handleChoice = (value: boolean) => {
        if (submitted) return;
        setSelectedAnswer(value);
        setSubmitted(true);
    };

    // 스탬프 찍는 로직 위치 변경
    const handleBackWithStamp = async () => {
        if (isCorrect && landmarkId) {
            try {
                const token = localStorage.getItem('token'); 
                
                await fetch('http://localhost:5000/api/stamps', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ landmarkId }) 
                });
            } catch (error) {
                console.error('스탬프 저장 중 오류 발생:', error);
            }
        }
        window.location.href = `/`; 
    };


    const handleRetry = () => {
        setSelectedAnswer(null);
        setSubmitted(false);
    };

    const cardClassName = submitted
        ? isCorrect
            ? 'border-green-400 bg-green-50'
            : 'border-red-400 bg-red-50'
        : 'border-pink-200 bg-white';

    return (
        <div className="min-h-screen bg-[#f8f8f8] px-4 py-6 pb-24">
            <div className="mx-auto max-w-2xl">
                <div
                    className={`rounded-[28px] border-[4px] p-5 shadow-sm transition-all ${cardClassName}`}
                >
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-[15px] text-slate-700">{quiz.category}</p>
                        </div>

                        <button
                            type="button"
                            className="shrink-0 rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                            onClick={() => window.history.back()}
                        >
                            뒤로
                        </button>
                    </div>

                    <div className="mt-6">
                        <p className="text-right text-[15px] text-slate-700">{landmarkName}</p>
                        <p className="mt-2 text-[18px] leading-9 text-slate-800">
                            {quiz.title}
                        </p>
                    </div>

                    <div className="my-6 border-t border-slate-300" />

                    <div className="space-y-4">
                        <button
                            type="button"
                            onClick={() => handleChoice(true)}
                            className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-5 text-left transition ${
                                submitted
                                    ? selectedAnswer === true
                                        ? isCorrect
                                            ? 'border-green-500 bg-white'
                                            : 'border-red-500 bg-white'
                                        : 'border-slate-200 bg-white'
                                    : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                            }`}
                        >
                            <span className="text-[22px] font-semibold text-slate-800">O</span>
                            <span className="text-[16px] text-slate-700">맞다</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleChoice(false)}
                            className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-5 text-left transition ${
                                submitted
                                    ? selectedAnswer === false
                                        ? isCorrect
                                            ? 'border-green-500 bg-white'
                                            : 'border-red-500 bg-white'
                                        : 'border-slate-200 bg-white'
                                    : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                            }`}
                        >
                            <span className="text-[22px] font-semibold text-slate-800">X</span>
                            <span className="text-[16px] text-slate-700">틀리다</span>
                        </button>
                    </div>

                    {submitted && (
                        <div
                            className={`mt-6 rounded-2xl border px-4 py-4 ${
                                isCorrect
                                    ? 'border-green-300 bg-green-100'
                                    : 'border-red-300 bg-red-100'
                            }`}
                        >
                            <p
                                className={`text-[17px] font-semibold ${
                                    isCorrect ? 'text-green-700' : 'text-red-700'
                                }`}
                            >
                                {isCorrect ? '정답입니다.' : '오답입니다.'}
                            </p>

                            <p className="mt-3 text-[15px] leading-7 text-slate-800">
                                {quiz.explanation}
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-5 flex gap-3">
                    <button
                        type="button"
                        onClick={handleRetry}
                        className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-white hover:bg-slate-800"
                    >
                        다시 풀기
                    </button>

                    <button
                        type="button"
                        onClick={handleBackWithStamp}
                        className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-700 hover:bg-slate-50"
                    >
                        지도로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
}