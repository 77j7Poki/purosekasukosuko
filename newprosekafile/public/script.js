let sukoCount = 0;

function tapButton(buttonNumber) {
    fetch(`/tap?button=${buttonNumber}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById(`count${buttonNumber}`).textContent = data.count;
    })
    .catch(error => console.error('Error:', error));
}

function updateCounts() {
    fetch('/counts')
    .then(response => response.json())
    .then(data => {
        for (let i = 1; i <= 4; i++) {
            document.getElementById(`count${i}`).textContent = data.counts[i - 1];
        }
    })
    .catch(error => console.error('Error:', error));
}

// 初回ロード時にカウントを更新
document.addEventListener('DOMContentLoaded', updateCounts);



function tapButton(buttonNumber) {
    const countElement = document.getElementById(`count${buttonNumber}`);
    const currentCount = parseInt(countElement.textContent, 10);
    countElement.textContent = currentCount + 1;
    sukoCount++; // 総すこカウントを増やす
}

function shareSuko() {
    const tweetText = `ビビバスを${sukoCount}回、すこすこしました！ #ビビバスすこすこカウンター`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(url, '_blank'); // 新しいタブでTwitterシェア
}