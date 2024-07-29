// 下一个标签页
api.map("K", "R");
api.map("gt", "R");

// 前一个标签页
api.map("J", "E");
api.map("gT", "E");

api.aceVimMap("jj", "<Esc>", "insert");

// 自定义的标记对象
window.customMarks = {};

// 设置标记的函数
function setMark(mark) {
  window.customMarks[mark] = window.scrollY;
  api.Front.showBanner(
    "Mark " + mark + " set at position " + window.customMarks[mark],
  );
}

// 跳转到标记的函数
function jumpToMark(mark) {
  if (window.customMarks[mark] !== undefined) {
    window.scrollTo(0, window.customMarks[mark]);
    Front.showBanner(
      "Jumped to mark " + mark + " at position " + window.customMarks[mark],
    );
  } else {
    api.Front.showBanner("Mark " + mark + " not set");
  }
}

// 设置标记的键绑定
api.mapkey("Ma", "#0 Set mark `a` at current scroll position", function () {
  setMark("a");
});

api.mapkey("Mb", "#0 Set mark `b` at current scroll position", function () {
  setMark("b");
});

api.mapkey("Mc", "#0 Set mark `c` at current scroll position", function () {
  setMark("c");
});
api.mapkey("Md", "#0 Set mark `d` at current scroll position", function () {
  setMark("d");
});
api.mapkey("Me", "#0 Set mark `e` at current scroll position", function () {
  setMark("e");
});

// 跳转到标记的键绑定
api.mapkey('"a', "#0 Jump to mark `a`", function () {
  jumpToMark("a");
});

api.mapkey('"b', "#0 Jump to mark `b`", function () {
  jumpToMark("b");
});

api.mapkey('"c', "#0 Jump to mark `c`", function () {
  jumpToMark("c");
});

api.mapkey('"d', "#0 Jump to mark `d`", function () {
  jumpToMark("d");
});

api.mapkey('"e', "#0 Jump to mark `e`", function () {
  jumpToMark("e");
});
// 如此类推，你可以为 c, d, e 等设置更多标记

// Utility function to show popup messages with icons in the video area

//视屏播放控制

//show popup
function showPopup(
  message,
  icon = "",
  position = "center",
  kind = "",
  permanent = false,
) {
  const video = getCurrentVideo();
  if (!video) {
    console.error("没有找到视频元素");
    return;
  }
  id = "video-popup" + kind;
  let popup = document.getElementById(id);
  if (!popup) {
    popup = document.createElement("div");
    popup.id = id;
    popup.style.position = "fixed";
    popup.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    popup.style.color = "white";
    popup.style.padding = "10px";
    popup.style.borderRadius = "5px";
    popup.style.fontSize = "16px";
    popup.style.zIndex = "2147483647"; // Very high zIndex value
    popup.style.display = "none"; // Initially hidden
    document.body.appendChild(popup); // Append to the document body
  }

  const rect = video.getBoundingClientRect();
  const popupWidth = 200; // Popup width
  const popupHeight = 50; // Popup height

  // Adjust position for normal screen
  if (position === "center") {
    popup.style.left = `${rect.left + rect.width / 2 - popupWidth / 2}px`;
    popup.style.top = `${rect.top + rect.height / 2 - popupHeight / 2}px`;
  } else if (position === "top-left") {
    popup.style.left = `${rect.left}px`;
    popup.style.top = `${rect.top}px`;
  }

  // Set the message and icon
  popup.innerHTML = `${icon} ${message}`;
  popup.style.display = "block";

  // Hide the popup after 2 seconds
  if (!permanent) {
    setTimeout(() => {
      popup.style.display = "none";
    }, 2000);
  }
}

// Toggle mute and show appropriate icon
function toggleMute() {
  const video = getCurrentVideo();
  if (!video) {
    //showPopup("请先聚焦视频");
    window.alert("请先聚焦视频");
    return;
  }

  video.muted = !video.muted;
  const icon = video.muted ? "🔈" : "🔊"; // Mute and unmute icons

  if (video.muted) {
    showPopup("已静音", icon, "top-left", "mute", true);
  } else {
    showPopup("解除静音", icon, "top-left", "mute", false);
  }
}

// Initialize video list and current index
let videoList = [];
let currentVideo = null;
let currentVideoIndex = 0;

// Function to get all video elements on the page
function getVideoList() {
  const videos = document.querySelectorAll("video");
  console.log("Found videos:", videos); // 添加调试日志
  return Array.from(videos);
}

// Update video list and focus on the first video
function initializeVideoList() {
  videoList = getVideoList();
  if (videoList.length > 0) {
    currentVideoIndex = 0;
    //focusVideo(); // Optionally focus on the first video
  }
}

// Get the current video element
function getCurrentVideo() {
  if (videoList.length === 0) {
    return null;
  }
  let video = videoList[currentVideoIndex % videoList.length];
  video.focus();
  return video;
}

function simulateDoubleClickOnVideo() {
  const video = getCurrentVideo();
  if (!video) {
    showPopup("请先聚焦视频");
    return;
  }

  // 创建双击事件
  const event = new MouseEvent("dblclick", {
    bubbles: true,
    cancelable: true,
    view: window,
  });

  // 触发双击事件
  video.dispatchEvent(event);
  showPopup("已切换全屏模式");
}

function fullscreenVideo() {
  const video = getCurrentVideo();
  if (!video) {
    showPopup("请先聚焦视频");
    return;
  }

  if (document.fullscreenElement || video.classList.contains("fullscreen")) {
    // 当前是全屏状态，退出全屏
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      // Firefox
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      // Chrome, Safari and Opera
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      // IE/Edge
      document.msExitFullscreen();
    }

    showPopup("已退出全屏模式");
  } else {
    // 当前不是全屏状态，进入全屏
    try {
      // 创建双击事件
      const event = new MouseEvent("dblclick", {
        bubbles: true,
        cancelable: true,
        view: window,
      });

      // 触发双击事件
      video.dispatchEvent(event);
      setTimeout(() => {
        // 检查全屏状态，如果没有进入全屏则尝试使用 requestFullscreen
        if (
          !document.fullscreenElement &&
          !video.classList.contains("fullscreen")
        ) {
          fallbackToFullscreen(video);
        } else {
          showPopup("已进入全屏模式");
        }
      }, 500); // 延迟500ms检查全屏状态
    } catch (error) {
      console.error("双击全屏切换失败，尝试使用 requestFullscreen:", error);
      fallbackToFullscreen(video);
    }
  }
}

function fallbackToFullscreen(video) {
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.mozRequestFullScreen) {
    // Firefox
    video.mozRequestFullScreen();
  } else if (video.webkitRequestFullscreen) {
    // Chrome, Safari and Opera
    video.webkitRequestFullscreen();
  } else if (video.msRequestFullscreen) {
    // IE/Edge
    video.msRequestFullscreen();
  }
  showPopup("已进入全屏模式 (备用方法)");
}

//function fullscreenVideo() {
//  const hostname = window.location.hostname;
//
//  // Define selectors for different sites
//  const selectors = {
//    "youtube.com": ".ytp-fullscreen-button",
//    "vimeo.com": ".vimeo-video-controls .fullscreen",
//    "twitch.tv": ".player-fullscreen-toggle",
//    "dailymotion.com": ".player-controls .fullscreen", // Example, may vary
//    "pornhub.com": ".player-controls .fullscreen", // Example, may vary
//    "netflix.com": ".button-nfplayerFullscreen", // Example, may vary
//    "hulu.com": ".controls-button--fullscreen", // Example, may vary
//    "disneyplus.com": ".button--fullscreen", // Example, may vary
//    "v.youku.com": ".kui-fullscreen-icon-0",
//    "tv.cctv.com": "#player_fullscreen_player", // Example, may vary
//    "iqiyi.com": "use.iqp-svg-symbol",
//  };
//
//  // Determine the correct selector based on the current website
//  const fullscreenButtonSelector = Object.entries(selectors).find(
//    ([site, selector]) => hostname.includes(site),
//  )?.[1];
//
//  if (fullscreenButtonSelector) {
//    const fullscreenButton = document.querySelector(fullscreenButtonSelector);
//    if (fullscreenButton) {
//      simulateClick(fullscreenButton);
//      showPopup("已切换全屏模式");
//    } else {
//      fallbackFullscreen();
//    }
//  } else {
//    fallbackFullscreen();
//  }
//}
//
//function simulateClick(element) {
//  if (element) {
//    const event = new MouseEvent("click", {
//      view: window,
//      bubbles: true,
//      cancelable: true,
//    });
//    element.dispatchEvent(event);
//  }
//}
//
//function fallbackFullscreen() {
//  const video = getCurrentVideo();
//  if (!video) {
//    showPopup("请先聚焦视频");
//    return;
//  }
//  if (document.fullscreenElement) {
//    // Exit fullscreen
//    if (document.exitFullscreen) {
//      document.exitFullscreen();
//    } else if (document.mozCancelFullScreen) {
//      // Firefox
//      document.mozCancelFullScreen();
//    } else if (document.webkitExitFullscreen) {
//      // Chrome, Safari and Opera
//      document.webkitExitFullscreen();
//    } else if (document.msExitFullscreen) {
//      // IE/Edge
//      document.msExitFullscreen();
//    }
//    showPopup("已退出全屏模式");
//  } else {
//    // Enter fullscreen
//    if (video.requestFullscreen) {
//      video.requestFullscreen();
//    } else if (video.mozRequestFullScreen) {
//      // Firefox
//      video.mozRequestFullScreen();
//    } else if (video.webkitRequestFullscreen) {
//      // Chrome, Safari and Opera
//      video.webkitRequestFullscreen();
//    } else if (video.msRequestFullscreen) {
//      // IE/Edge
//      video.msRequestFullscreen();
//    }
//    showPopup("已进入全屏模式");
//  }
//}
// Focus on video
function focusVideo() {
  if (videoList.length > 0) {
    const video = getCurrentVideo();
    video.focus();
    showPopup(`已聚焦到视频 #${currentVideoIndex + 1}`);
  } else {
    //showPopup("页面上没有找到视频");
    window.alert("无法聚焦视频");
  }
}

// Fast forward by a specified number of seconds
function fastForward(seconds = 10) {
  const video = getCurrentVideo();
  if (video) {
    video.currentTime = Math.min(video.duration, video.currentTime + seconds);
    showPopup(`快进 ${seconds} 秒`);
  } else {
    //showPopup("请先聚焦视频");
    window.alert("请先聚焦视频");
  }
}

// Rewind by a specified number of seconds
function rewind(seconds = 10) {
  const video = getCurrentVideo();
  if (video) {
    video.currentTime = Math.max(0, video.currentTime - seconds);
    showPopup(`后退 ${seconds} 秒`);
  } else {
    window.alert("请先聚焦视频");
    //showPopup("请先聚焦视频");
  }
}

// Increase playback speed
function increasePlaybackSpeed(rate = 0.1) {
  const video = getCurrentVideo();
  if (video) {
    video.playbackRate += rate;
    //showPopup(`播放速度增加 ${rate}当前速度 ${video.playbackRate.toFixed(1)}`);
    //showPopup("当前速度 ${video.playbackRate.toFixed(1)}");
    const formattedSpeed = (Math.round(video.playbackRate * 10) / 10).toFixed(
      1,
    );
    showPopup(`当前速度 ${formattedSpeed}`);
  } else {
    //showPopup("请先聚焦视频");
    window.alert("请先聚焦视频");
  }
}

// Decrease playback speed
function decreasePlaybackSpeed(rate = 0.1) {
  const video = getCurrentVideo();
  if (video) {
    video.playbackRate -= rate;
    showPopup(`当前速度 ${formattedSpeed}`);
  } else {
    //showPopup("请先聚焦视频");
    window.alert("请先聚焦视频");
  }
}

// Reset playback speed
function resetPlaybackSpeed() {
  const video = getCurrentVideo();
  if (video) {
    video.playbackRate = 1.0;
    showPopup("播放速度已重置");
  } else {
    //showPopup("请先聚焦视频");
    window.alert("请先聚焦视频");
  }
}

// Switch to next video
function nextVideo() {
  if (videoList.length > 0) {
    currentVideoIndex = (currentVideoIndex + 1) % videoList.length;
    focusVideo();
    showPopup(`切换到视频 #${currentVideoIndex + 1}`);
  } else {
    //showPopup("页面上没有找到视频");
    window.alert("页面上没有找到视频");
  }
}

// Switch to previous video
function previousVideo() {
  if (videoList.length > 0) {
    currentVideoIndex =
      (currentVideoIndex - 1 + videoList.length) % videoList.length;
    focusVideo();
    showPopup(`切换到视频 #${currentVideoIndex + 1}`);
  } else {
    window.alert("页面上没有找到视频");
    //showPopup("页面上没有找到视频");
  }
}

// 增加视频音量
function increaseVolume(rate = 0.1) {
  const video = getCurrentVideo();
  if (video) {
    video.volume = Math.min(video.volume + rate, 1.0);
    showPopup(`当前音量 ${Math.round(video.volume * 100)}%`);
  } else {
    //showPopup("请先聚焦视频");
    window.alert("请先聚焦视频");
  }
}

// 减少视频音量
function decreaseVolume(rate = 0.1) {
  const video = getCurrentVideo();
  if (video) {
    video.volume = Math.max(video.volume - rate, 0.0);
    showPopup(`当前音量 ${Math.round(video.volume * 100)}%`);
  } else {
    //showPopup("请先聚焦视频");
    window.alert("请先聚焦视频");
  }
}

// Initialize video list on 'gv' key press
api.mapkey("gv", "聚焦视频", function () {
  initializeVideoList();
  focusVideo();
});

api.mapkey("g-", "增加音量", function () {
  increaseVolume(0.1);
});

api.mapkey("g+", "降低音量", function () {
  decreaseVolume(0.1);
});

// Mapping other keys to video actions
api.mapkey("gf", "全屏视频播放", fullscreenVideo);

api.mapkey("gk", "快进", function () {
  fastForward(10);
});

api.mapkey("gj", "后退", function () {
  rewind(10);
});

api.mapkey("gl", "增加播放速度", function () {
  increasePlaybackSpeed(0.1);
});

api.mapkey("gh", "减慢播放速度", function () {
  decreasePlaybackSpeed(0.1);
});

api.mapkey("gr", "重置播放速度", resetPlaybackSpeed);
api.mapkey("gm", "切换静音", toggleMute);
api.mapkey("<Alt-j>", "切换到下一个视频", nextVideo);
api.mapkey("<Alt-k>", "切换到上一个视频", previousVideo);

// Register inline query

api.Front.registerInlineQuery({
  url: function (q) {
    return `http://dict.youdao.com/w/eng/${q}/#keyfrom=dict2.index`;
  },
  parseResult: function (res) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(res.text, "text/html");
    var collinsResult = doc.querySelector("#collinsResult");
    var authTransToggle = doc.querySelector("#authTransToggle");
    var examplesToggle = doc.querySelector("#examplesToggle");
    if (collinsResult) {
      collinsResult
        .querySelectorAll("div>span.collinsOrder")
        .forEach(function (span) {
          span.nextElementSibling.prepend(span);
        });
      collinsResult.querySelectorAll("div.examples").forEach(function (div) {
        div.innerHTML = div.innerHTML
          .replace(/<p/gi, "<span")
          .replace(/<\/p>/gi, "</span>");
      });
      var exp = collinsResult.innerHTML;
      return exp;
    } else if (authTransToggle) {
      authTransToggle.querySelector("div.via.ar").remove();
      return authTransToggle.innerHTML;
    } else if (examplesToggle) {
      return examplesToggle.innerHTML;
    }
  },
});

settings.theme = `
.sk_theme {
    font-family: Input Sans Condensed, Charcoal, sans-serif;
    font-size: 10pt;
    background: #121212; /* 更深的背景色以增强对比度 */
    color: #e0e0e0; /* 更亮的文字颜色 */
}

.sk_theme tbody {
    color: #b0b0b0; /* 适度亮度的表格文字颜色 */
}

.sk_theme input {
    color: #d0d0d0; /* 更亮的输入框文字颜色 */
}

.sk_theme .url {
    color: #a0a0a0; /* 亮度适中的链接颜色 */
}

.sk_theme .annotation {
    color: #c0c0c0; /* 适度亮度的注释颜色 */
}

.sk_theme .omnibar_highlight {
    color: #e0e0e0; /* 高对比度的高亮颜色 */
}

.sk_theme #sk_omnibarSearchResult ul li:nth-child(odd) {
    background: #1a1a1a; /* 更深的背景色以增强对比度 */
}

.sk_theme #sk_omnibarSearchResult ul li.focused {
    background: #2a2a2a; /* 高对比度的选中项背景色 */
}

#sk_status, #sk_find {
    font-size: 18pt; /* 略微减少字体大小以保持简洁 */
    color: #e0e0e0; /* 更亮的状态和搜索文字颜色 */
}

:root {
    --theme-ace-bg: #121212ab; /* 更深的背景颜色带有透明度 */
    --theme-ace-bg-accent: #1a1a1a; /* 深背景色 */
    --theme-ace-fg: #e0e0e0; /* 高对比度的文字颜色 */
    --theme-ace-fg-accent: #b0b0b0; /* 适度亮度的文字颜色 */
    --theme-ace-cursor: #f0f0f0; /* 更亮的光标颜色 */
    --theme-ace-select: #3a3a3a; /* 高对比度的选择背景色 */
}

#sk_editor {
    height: 50% !important; /* 保持编辑器高度 */
    background: var(--theme-ace-bg) !important;
}

.ace_dialog-bottom {
    border-top: 1px solid var(--theme-ace-bg) !important;
}

.ace-chrome .ace_print-margin, .ace_gutter, .ace_gutter-cell, .ace_dialog {
    background: var(--theme-ace-bg-accent) !important;
}

.ace-chrome {
    color: var(--theme-ace-fg) !important;
}

.ace_gutter, .ace_dialog {
    color: var(--theme-ace-fg-accent) !important;
}

.ace_cursor {
    color: var(--theme-ace-cursor) !important;
}

.normal-mode .ace_cursor {
    background-color: var(--theme-ace-cursor) !important;
    border: var(--theme-ace-cursor) !important;
}

.ace_marker-layer .ace_selection {
    background: var(--theme-ace-select) !important;
}`;
