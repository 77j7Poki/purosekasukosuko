let sukoCount = 0;

async function tapButton(buttonNumber) {
    try {
        const response = await fetch(`/api?button=${buttonNumber}`, { // APIパスを変更
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        document.getElementById(`count${buttonNumber}`).textContent = data.count;

        // ボタンをクリックするたびに全体のカウントを更新
        await updateCounts(); 

    } catch (error) {
        console.error('Error:', error);
    }
}

async function updateCounts() {
    try {
        const response = await fetch('/api', { // APIパスを変更
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        for (let i = 1; i <= 4; i++) {
            document.getElementById(`count${i}`).textContent = data.counts[i - 1];
        }

        // 総すこカウントを更新
        sukoCount = data.counts.reduce((acc, cur) => acc + cur, 0);

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
