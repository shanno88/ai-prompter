/**
 * 播感 JSON → Kling multi-shot 请求体转换器
 */

// 场景角色映射规则（根据 section 判定）
const SCENE_ROLE_MAP = {
  '留人': 'hook',
  '放钩子': 'hook',
  '价值': 'value_prop',
  '讲痛点': 'pain_point',
  '讲人设': 'credibility',
  '比价': 'price_comparison',
  '保障': 'trust_building',
  '讲试题/干货': 'content_demo',
  '讲干货': 'content_demo',
  '讲进群': 'lead_generation',
  '稀缺': 'cta',
  '发福袋': 'cta'
};

// 镜头提示映射（根据 scene_role）
const CAMERA_HINT_MAP = {
  'hook': 'medium_shot',
  'value_prop': 'medium_shot',
  'pain_point': 'medium_shot',
  'credibility': 'medium_close_up',
  'price_comparison': 'medium_shot',
  'trust_building': 'medium_close_up',
  'content_demo': 'close_up',
  'lead_generation': 'medium_shot',
  'cta': 'close_up',
  'general': 'medium_shot'
};

// 动作提示映射（根据 scene_role）
const ACTION_HINT_MAP = {
  'hook': 'hand_gesture_stop',
  'value_prop': 'pointing_to_product',
  'pain_point': 'worried_look',
  'credibility': 'confident_posture',
  'price_comparison': 'comparison_gesture',
  'trust_building': 'hand_on_heart',
  'content_demo': 'explaining_gesture',
  'lead_generation': 'pointing_down',
  'cta': 'countdown_gesture',
  'general': 'natural_gesture'
};

// 情绪映射（根据 scene_role）
const EMOTION_MAP = {
  'hook': 'excited',
  'value_prop': 'enthusiastic',
  'pain_point': '担忧',
  'credibility': 'confident',
  'price_comparison': 'confident',
  'trust_building': 'reassuring',
  'content_demo': 'focused',
  'lead_generation': 'encouraging',
  'cta': 'urgent',
  'general': 'neutral'
};

/**
 * 从 section 文本中提取场景角色
 * 先清理 section 中的数字、括号、时长说明，再进行关键词匹配
 */
function extractSceneRole(section) {
  if (!section) return 'general';
  
  // 清理 section：去掉开头的编号（①②③）、括号内容（约X秒）、空格
  const cleanedSection = section
    .replace(/^[①②③④⑤⑥⑦⑧⑨⑩]\s*/, '')  // 去掉编号
    .replace(/[（(][^）)]*[）)]\s*/, '')    // 去掉括号内容（如：约3秒）
    .replace(/\s+/g, ' ')                    // 多个空格合并为一个
    .trim();
  
  for (const [keyword, role] of Object.entries(SCENE_ROLE_MAP)) {
    if (cleanedSection.includes(keyword)) {
      return role;
    }
  }
  
  return 'general';
}

/**
 * 生成 Kling prompt（中文版）
 */
function generatePrompt(segment, sceneRole, cameraHint, actionHint, emotion) {
  const cameraDesc = {
    'medium_shot': '中景镜头',
    'close_up': '特写镜头',
    'medium_close_up': '中近景镜头'
  }[cameraHint] || '中景镜头';

  const actionDesc = {
    'hand_gesture_stop': '做出停止手势',
    'pointing_to_product': '指向产品',
    'worried_look': '关切的表情',
    'confident_posture': '自信的姿态',
    'comparison_gesture': '比较手势',
    'hand_on_heart': '手放在心口',
    'explaining_gesture': '讲解手势',
    'pointing_down': '指向下方',
    'countdown_gesture': '倒计时手势'
  }[actionHint] || '自然手势';

  const emotionDesc = {
    'excited': '兴奋',
    'enthusiastic': '热情',
    'worried': '关切',
    'confident': '自信',
    'reassuring': '令人安心',
    'focused': '专注',
    'encouraging': '鼓励',
    'urgent': '紧迫'
  }[emotion] || 'neutral';

  return `现代演播室内的专业主播，${cameraDesc}，${actionDesc}，${emotionDesc}的表情，明亮的灯光，9:16竖屏格式。台词："${segment.raw_text.substring(0, 50)}..."}`;
}

/**
 * 转换 v1 JSON 为 Kling multi-shot 请求体
 */
function convertScriptToKling(scriptJson) {
  const shots = scriptJson.segments.map((segment, index) => {
    const sceneRole = extractSceneRole(segment.section);
    const cameraHint = CAMERA_HINT_MAP[sceneRole] || 'medium_shot';
    const actionHint = ACTION_HINT_MAP[sceneRole] || 'natural_gesture';
    const emotion = EMOTION_MAP[sceneRole] || 'neutral';

    const prompt = generatePrompt(segment, sceneRole, cameraHint, actionHint, emotion);

    return {
      shot_id: `shot_${index + 1}`,
      prompt: prompt,
      duration: segment.duration_hint,
      camera_movement: index === scriptJson.segments.length - 1 ? 'static' : 'static',
      reference_images: []
    };
  });

  return {
    model: 'kling-v1.5',
    mode: 'pro',
    duration: scriptJson.metadata.total_duration_hint,
    aspect_ratio: '9:16',
    style: {
      preset: 'live_broadcast',
      color_grading: 'vibrant',
      scene_consistency: 'high'
    },
    shots: shots
  };
}

// 命名导出（ES6）和 CommonJS 双模式支持
export { convertScriptToKling, extractSceneRole, generatePrompt };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { convertScriptToKling, extractSceneRole, generatePrompt };
}
