async function fetchLatestResults() {
    try {
        const response = await fetch('https://api.bjcxe.com/h5/mtop.alicpbingo.alicpraceservice.getlatestdata/1.0/?gid=1');
        const data = await response.json();
        
        if (data.ret[0].startsWith('SUCCESS')) {
            updateResultsDisplay(data.data);
        } else {
            console.error('API调用失败:', data.ret[0]);
        }
    } catch (error) {
        console.error('获取数据失败:', error);
        document.getElementById('error-message').textContent = '获取数据失败，请稍后重试';
    }
}

function updateResultsDisplay(data) {
    // 更新历史记录
    const historiesContainer = document.getElementById('histories');
    historiesContainer.innerHTML = data.histories
        .map(history => {
            // 格式化期号显示
            const issueNumber = formatIssueNumber(history.issue);
            return `
                <div class="history-item">
                    <div class="issue">第${issueNumber}期</div>
                    <div class="time">${formatDate(history.issueTime)}</div>
                    <div class="result">
                        <span class="result-numbers">${formatResult(history.result)}</span>
                        ${history.result.split(',').map((num, index) => 
                            `<span class="animal-letter">${data.record[0].result[index]}</span>`
                        ).join('')}
                    </div>
                </div>
            `;
        }).join('');

    // 更新当前记录
    const currentRecord = document.getElementById('current-record');
    if (data.record && data.record.length > 0) {
        const currentIssue = formatIssueNumber(data.record[0].issue);
        currentRecord.innerHTML = `
            <div class="current-issue">第${currentIssue}期</div>
            <div class="current-result">
                <span class="result-numbers">${formatResult(data.record[0].result.join(','))}</span>
                ${data.record[0].result.map(letter => 
                    `<span class="animal-letter">${letter}</span>`
                ).join('')}
            </div>
        `;
    }

    // 更新统计数据
    const statsContainer = document.getElementById('statistics');
    statsContainer.innerHTML = data.total
        .map(stat => {
            const [letter, count] = stat.split('_');
            return `
                <div class="stat-item">
                    <span class="letter">${letter}</span>
                    <span class="count">${count}次</span>
                </div>
            `;
        }).join('');
}

// 格式化期号
function formatIssueNumber(issue) {
    // 从完整期号中提取序号部分（最后4位）
    return issue.slice(-4);
}

// 格式化结果显示
function formatResult(result) {
    if (typeof result === 'string') {
        return result.split(',').join(' - ');
    }
    return result.join(' - ');
}

// 格式化日期显示
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// 添加历史记录查询函数
async function fetchHistoryByDate() {
    const dateInput = document.getElementById('historyDate');
    if (!dateInput.value) {
        document.getElementById('error-message').textContent = '请选择日期';
        return;
    }

    // 格式化日期为YYYYMMDD格式
    const dateStr = dateInput.value.replace(/-/g, '');
    
    try {
        const response = await fetch(`https://api.bjcxe.com/h5/mtop.alicpbingo.alicpraceservice.getHistoryListByIssue/1.0/?gid=1&issueNo=${dateStr}`);
        const data = await response.json();
        
        if (data.ret[0].startsWith('SUCCESS')) {
            updateHistoryDisplay(data.data);
        } else {
            console.error('历史记录查询失败:', data.ret[0]);
            document.getElementById('error-message').textContent = '历史记录查询失败';
        }
    } catch (error) {
        console.error('获取历史数据失败:', error);
        document.getElementById('error-message').textContent = '获取历史数据失败，请稍后重试';
    }
}

function updateHistoryDisplay(data) {
    const historiesContainer = document.getElementById('histories');
    
    if (!data.histories || data.histories.length === 0) {
        historiesContainer.innerHTML = '<div class="no-data">该日期没有历史记录</div>';
        return;
    }

    historiesContainer.innerHTML = data.histories
        .map(history => `
            <div class="history-item">
                <div class="issue">期号: ${history.issue}</div>
                <div class="time">${formatDate(history.issueTime)}</div>
                <div class="result">
                    <span class="result-numbers">${history.result}</span>
                    ${history.result.split(',').map((num, index) => 
                        `<span class="animal-letter">${data.record[0].result[index]}</span>`
                    ).join('')}
                </div>
            </div>
        `).join('');
}

// 添加实时时间显示功能
function updateCurrentTime() {
    const now = new Date();
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    
    // 格式化时间
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const weekday = weekdays[now.getDay()];

    // 组合时间字符串
    const timeString = `${year}/${month}/${date} ${weekday} ${hours}:${minutes}:${seconds}`;
    
    // 更新显示
    document.getElementById('current-time').textContent = timeString;
}

// 页面加载时初始化时间显示
document.addEventListener('DOMContentLoaded', () => {
    updateCurrentTime(); // 立即显示时间
    setInterval(updateCurrentTime, 1000); // 每秒更新一次
    
    const today = new Date();
    const dateInput = document.getElementById('historyDate');
    dateInput.value = today.toISOString().split('T')[0];
    dateInput.max = today.toISOString().split('T')[0]; // 限制最大日期为今天
    
    fetchLatestResults();
    fetchHistoryByDate(); // 自动加载今天的历史记录
});

// 页面加载时获取数据
document.addEventListener('DOMContentLoaded', fetchLatestResults);
// 每60秒刷新一次数据
setInterval(fetchLatestResults, 60000);

// 添加iframe错误处理函数
function handleIframeError(iframe) {
    iframe.style.display = 'none';
    iframe.nextElementSibling.style.display = 'block';
}

function handleIframeLoad(iframe) {
    try {
        // 尝试访问iframe内容，如果失败则说明有跨域限制
        iframe.contentWindow.location.href;
    } catch (e) {
        handleIframeError(iframe);
    }
} 