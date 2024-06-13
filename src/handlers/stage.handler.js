// 유저는 스테이지를 하나씩 올라갈 수 있다. (1스테이지 -> 2, 2 -> 3)
// 유저는 일정 점수가 되면 다음 스테이지로 이동한다.

import { getGameAssets } from "../init/assets.js";
import { setStage, getStage } from "../models/stage.model.js";

export const moveStageHandler = (userId, payload) => {
  
  // 유저의 현재 스테이지 정보
  let currentStages = getStage(userId);
  if(!currentStages.length) {
    return { status: 'fail', message: "No stages found for user"}
  }
  
  // 오름차순 -> 가장 큰 스테이지 ID를 확인 << 유저의 현재 스테이지
  currentStages.sort((a,b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length-1];

  if(currentStage.id !== payload.currentStage) {
    return { status: "fail", message: "Current Stage mismatch" }
  }

  // 점수 검증
  const serverTime = Date.now();
  const elapsedTime = (serverTime - currentStage.timestamp) / 1000;

  // 1스테이지 -> 2스테이지 과정
  // 5는 임의로 정한 오차 범위이다.
  // stage.json에서 데이터를 참조하여 조건문을 생성한다 <-- 과제내용?
  if (elapsedTime < 9.9 || elapsedTime > 10.5) {
    return { status: 'fail', message: `Invalid elapsed time / elapsedTime: ${elapsedTime}` };
  }

  // targetStage에 대한 검증 <- 게임 에셋에 존재하는가?
  const { stages } = getGameAssets();
  if(!stages.data.some((stage) => stage.id === payload.targetStage)) {
    return { status: 'fail', message: "Target stage not found" };
  }
  
  // 현재 점수가 스테이지에 설정된 점수보다 높아야 다음 스테이지로 넘겨 줄 수 있다.
  // 과제에 예정



  // 유저의 다음 스테이지 정보 업데이트 + 현재 시간
  setStage(userId, payload.targetStage, serverTime);
  return { status: "success" }
}