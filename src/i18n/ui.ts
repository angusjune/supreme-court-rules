/**
 * UI label dictionary for the four supported languages.
 * Content text lives in the MDX files; only chrome/labels live here.
 */

export const LANGS = ['en', 'fr', 'ja', 'zh'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';

/** Display names shown in the language switcher. */
export const LANG_NAMES: Record<Lang, string> = {
  en: 'English',
  fr: 'Français',
  ja: '日本語',
  zh: '中文',
};

type UIKey =
  | 'siteTitle'
  | 'tagline'
  | 'navDecisions'
  | 'navJustices'
  | 'latestDecision'
  | 'noDecisions'
  | 'recentDecisions'
  | 'allDecisions'
  | 'readEditorial'
  | 'backToDecisions'
  | 'outcome'
  | 'prevailingParty'
  | 'losingParty'
  | 'disposition'
  | 'vote'
  | 'decidedOn'
  | 'term'
  | 'docket'
  | 'majority'
  | 'joinedBy'
  | 'concurrence'
  | 'dissent'
  | 'lowerCourt'
  | 'held'
  | 'majorityOpinion'
  | 'dissentOpinion'
  | 'editorial'
  | 'editorialNote'
  | 'sources'
  | 'topics'
  | 'language'
  | 'leanConservative'
  | 'leanLiberal'
  | 'leanCenter'
  | 'winConservative'
  | 'winLiberal'
  | 'winNeutral';

export const ui: Record<Lang, Record<UIKey, string>> = {
  en: {
    siteTitle: 'Supreme Court Rules',
    tagline: 'How the US Supreme Court rules — decisions, explained.',
    navDecisions: 'Decisions',
    navJustices: 'Justices',
    latestDecision: 'Latest Decision',
    noDecisions: 'No decisions yet',
    recentDecisions: 'Recent Decisions',
    allDecisions: 'All Decisions',
    readEditorial: 'Read the editorial',
    backToDecisions: 'Back to decisions',
    outcome: 'The outcome',
    prevailingParty: 'Prevailing party',
    losingParty: 'Losing party',
    disposition: 'Disposition',
    vote: 'Vote',
    decidedOn: 'Decided',
    term: 'Term',
    docket: 'Docket',
    majority: 'Majority',
    joinedBy: 'Joined by',
    concurrence: 'Concurrence',
    dissent: 'Dissent',
    lowerCourt: 'On review from',
    held: 'Held',
    majorityOpinion: "The majority's opinion",
    dissentOpinion: 'The dissent',
    editorial: 'Editorial',
    editorialNote: 'Opinion — my take on the ruling',
    sources: 'Sources',
    topics: 'Topics',
    language: 'Language',
    leanConservative: 'Conservative',
    leanLiberal: 'Liberal',
    leanCenter: 'Center',
    winConservative: 'Conservative win',
    winLiberal: 'Liberal win',
    winNeutral: 'Neutral outcome',
  },
  fr: {
    siteTitle: 'Les décisions de la Cour suprême',
    tagline: 'Comment tranche la Cour suprême des États-Unis — les décisions expliquées.',
    navDecisions: 'Décisions',
    navJustices: 'Juges',
    latestDecision: 'Dernière décision',
    noDecisions: 'Aucune décision pour le moment',
    recentDecisions: 'Décisions récentes',
    allDecisions: 'Toutes les décisions',
    readEditorial: "Lire l'éditorial",
    backToDecisions: 'Retour aux décisions',
    outcome: 'Le résultat',
    prevailingParty: 'Partie gagnante',
    losingParty: 'Partie perdante',
    disposition: 'Décision',
    vote: 'Vote',
    decidedOn: 'Rendu le',
    term: 'Session',
    docket: 'Rôle',
    majority: 'Majorité',
    joinedBy: 'Rejoint par',
    concurrence: 'Opinion concordante',
    dissent: 'Opinion dissidente',
    lowerCourt: 'En appel de',
    held: 'Décision',
    majorityOpinion: "L'opinion majoritaire",
    dissentOpinion: "L'opinion dissidente",
    editorial: 'Éditorial',
    editorialNote: 'Opinion — mon analyse de la décision',
    sources: 'Sources',
    topics: 'Thèmes',
    language: 'Langue',
    leanConservative: 'Conservateur',
    leanLiberal: 'Libéral',
    leanCenter: 'Centre',
    winConservative: 'Victoire conservatrice',
    winLiberal: 'Victoire libérale',
    winNeutral: 'Résultat neutre',
  },
  ja: {
    siteTitle: '連邦最高裁の判決',
    tagline: '合衆国最高裁はどう判断したのか — 判決を解説。',
    navDecisions: '判決',
    navJustices: '裁判官',
    latestDecision: '最新の判決',
    noDecisions: '判決はまだありません',
    recentDecisions: '最近の判決',
    allDecisions: 'すべての判決',
    readEditorial: '論説を読む',
    backToDecisions: '判決一覧へ戻る',
    outcome: '結論',
    prevailingParty: '勝訴当事者',
    losingParty: '敗訴当事者',
    disposition: '処理',
    vote: '評決',
    decidedOn: '判決日',
    term: '開廷期',
    docket: '事件番号',
    majority: '法廷意見',
    joinedBy: '同調',
    concurrence: '補足意見',
    dissent: '反対意見',
    lowerCourt: '原審',
    held: '判示事項',
    majorityOpinion: '多数意見の要旨',
    dissentOpinion: '反対意見の要旨',
    editorial: '論説',
    editorialNote: '論説 — 判決についての私見',
    sources: '出典',
    topics: '争点',
    language: '言語',
    leanConservative: '保守',
    leanLiberal: 'リベラル',
    leanCenter: '中道',
    winConservative: '保守側の勝訴',
    winLiberal: 'リベラル側の勝訴',
    winNeutral: '中立的な結果',
  },
  zh: {
    siteTitle: '美国最高法院判决',
    tagline: '美国最高法院如何判决——判决解读。',
    navDecisions: '判决',
    navJustices: '大法官',
    latestDecision: '最新判决',
    noDecisions: '暂无判决',
    recentDecisions: '近期判决',
    allDecisions: '全部判决',
    readEditorial: '阅读社论',
    backToDecisions: '返回判决列表',
    outcome: '判决结果',
    prevailingParty: '胜诉方',
    losingParty: '败诉方',
    disposition: '处理',
    vote: '票数',
    decidedOn: '判决日期',
    term: '开庭期',
    docket: '案号',
    majority: '多数意见',
    joinedBy: '附议',
    concurrence: '协同意见',
    dissent: '异议',
    lowerCourt: '下级法院',
    held: '判旨',
    majorityOpinion: '多数意见摘要',
    dissentOpinion: '异议摘要',
    editorial: '社论',
    editorialNote: '观点 —— 我对本判决的评论',
    sources: '来源',
    topics: '主题',
    language: '语言',
    leanConservative: '保守派',
    leanLiberal: '自由派',
    leanCenter: '中间派',
    winConservative: '保守派胜出',
    winLiberal: '自由派胜出',
    winNeutral: '中立结果',
  },
};

/** Canonical disposition key -> localized label. */
const dispositions: Record<string, Record<Lang, string>> = {
  affirmed: { en: 'Affirmed', fr: 'Confirmé', ja: '原判決維持', zh: '维持原判' },
  reversed: { en: 'Reversed', fr: 'Infirmé', ja: '破棄', zh: '撤销' },
  'reversed-remanded': {
    en: 'Reversed & remanded',
    fr: 'Infirmé et renvoyé',
    ja: '破棄差戻し',
    zh: '撤销并发回',
  },
  vacated: { en: 'Vacated', fr: 'Annulé', ja: '取消し', zh: '撤销' },
  'vacated-remanded': {
    en: 'Vacated & remanded',
    fr: 'Annulé et renvoyé',
    ja: '取消し差戻し',
    zh: '撤销并发回',
  },
  'affirmed-in-part': {
    en: 'Affirmed in part',
    fr: 'Confirmé en partie',
    ja: '一部維持',
    zh: '部分维持',
  },
  dismissed: { en: 'Dismissed', fr: 'Rejeté', ja: '却下', zh: '驳回' },
};

/** Humanize an unknown disposition key as a fallback ("foo-bar" -> "Foo bar"). */
function humanize(key: string): string {
  const s = key.replace(/[-_]+/g, ' ').trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function dispositionLabel(key: string, lang: Lang): string {
  return dispositions[key]?.[lang] ?? humanize(key);
}

/** Lean key -> localized label (justice pages are English-only, but keep it tidy). */
export const leanLabel: Record<'conservative' | 'liberal' | 'center', string> = {
  conservative: 'Conservative',
  liberal: 'Liberal',
  center: 'Center',
};

export function t(lang: Lang): Record<UIKey, string> {
  return ui[lang] ?? ui[DEFAULT_LANG];
}
