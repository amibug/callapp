/**
 * @desc 模板工具
 */

const templates = {

  /**
   * 弹窗模板
   * @return {[type]} [description]
   */
  pop: () => {
    return `
      <div id="DebugPop">
        <div id="DebugPopbox">
          <ul id="DebugPopboxContent">
          </ul>
        </div>
        <button id="DebugPopboxClear" class="debug-button">清屏</button>
        <button id="DebugPopboxClose" class="debug-button">关闭</button>
      </div>
    `;
  },
  /**
   * 每条log
   * @param  {string} content [log内容]
   * @return {[type]}         [description]
   */
  popItem: (content) => {
    return `
      <li>${content}</li>
    `;
  }
};


export default templates;
