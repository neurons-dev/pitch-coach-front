export type Tip = {
  title: string;
  description: string;
};

export const PRESENTATION_TIPS: Tip[] = [
  { title: '적정 길이 5~8분', description: '3~5분 분량이 적절해요' },
  { title: '첫 30초가 중요해요', description: '핵심 메시지로 발표를 시작해 보세요' },
  { title: '말 속도 유지하기', description: '1분에 250~300자 속도가 듣기 좋아요' },
  { title: '잠깐의 멈춤도 전략', description: '중요한 내용 앞에서 한 박자 쉬어가세요' },
  { title: '결론 먼저 말하기', description: '두괄식 구성이 이해하기 쉬워요' },
  { title: '군더더기 줄이기', description: '"음", "어" 같은 말버릇을 줄여보세요' },
  { title: '숫자로 말하기', description: '구체적인 수치가 설득력을 높여요' },
  { title: '마무리 한 문장', description: '기억에 남을 핵심 문장으로 끝내보세요' },
];

export function getRandomTip(): Tip {
  const index = Math.floor(Math.random() * PRESENTATION_TIPS.length);
  return PRESENTATION_TIPS[index];
}
