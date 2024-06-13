import { getGameAssets } from "../init/assets.js"
import { setStage, getStage, clearStage } from "../models/stage.model.js"

export const gameStart = (uuid, payload) => {
  const { stages } = getGameAssets();
  clearStage(uuid);

  // stage 배열에서 0번째 = 첫번째 스테이지
  setStage(uuid, stages.data[0].id, payload.timestamp);
  console.log(`Stage: `, getStage(uuid));

  return { status: 'success' };
}

export const gameEnd = (uuid, payload) => {

  const { timestamp: gameEndTime, score } = payload;
  const stage = getStage(uuid);

  if(!stage) {
    return { status: 'fail', message: "No stages found for user" };
  }

  let totalScore = 0;
  stages.forEach((stage, index) => {
    let stageEndTime;
    if(index === stages.length-1) {
      stageEndTime = gameEndTime;
    } else {
      stageEndTime = stages[index+1].timestamp
    }

    const stageDuration = (stageEndTime - stage.timestamp) / 1000;
    // 스테이지당 개별점수 적용 - 개인과제?
    totalScore += stageDuration;
  })

  // 점수와 타임스탬프 검증
  if(Math.abs(score-totalScore) > 5) {
    return { status: 'fail', message: "Score verification Error" };
  }

  // DB에 저장한다고 가정한다면 : 게임결과 저장
  // setResult(userId, score, timestamp);

  return { status: 'success', message: "Game End", score };
}

