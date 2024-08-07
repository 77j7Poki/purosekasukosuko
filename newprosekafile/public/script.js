let sukoCount = 0;

async function tapButton(buttonNumber) {
    try {
        const response = await fetch(`/api/tap?button=${buttonNumber}`, {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        document.getElementById(`count${buttonNumber}`).textContent = data.count;
        sukoCount = data.count; // 最新のカウントを更新
    } catch (error) {
        console.error('Error:', error);
    }
}

async function updateCounts() {
    try {
        const response = await fetch('/api/counts');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        for (let i = 1; i <= 4; i++) {
            document.getElementById(`count${i}`).textContent = data.counts[i - 1];
            if (i === 1) { // 初回ロード時の総すこカウントを設定
                sukoCount = data.counts[i - 1];
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// 初回ロード時にカウントを更新
document.addEventListener('DOMContentLoaded', updateCounts);

function shareSuko() {
    const tweetText = `ビビバスを${sukoCount}回、すこすこしました！ #ビビバスすこすこカウンター`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(url, '_blank'); // 新しいタブでTwitterシェア
}
