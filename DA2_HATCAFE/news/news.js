// Nội dung bài viết với iframe nhúng từ Facebook
const newsData = [
    {
        iframe: `<iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FHatcafeandtea%2Fposts%2Fpfbid0seM1wuaD1pXhnYjuBgQvUgrX9jcRcD7TGneuoHCjT6swJ6KLgpnUTw2NP6SFr1dQl&show_text=true&width=500" width="500" height="540" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>`
    },
    {
        iframe: `<iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FHatcafeandtea%2Fposts%2Fpfbid0sxh8pijF994Qb6xk3VHDDxoeZEawW2vcsLTBQJtw9ahmrB8jp66EXpCmjZvzhGxgl&show_text=true&width=500" width="500" height="698" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>`
    },
    {
        iframe: `<iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FHatcafeandtea%2Fposts%2Fpfbid027RSFvpy9tyhREmtYALyZtNozkP8snh62ksWuncm6gJVQ2gkDEw6prdCBU983BhDtl&show_text=true&width=500" width="500" height="648" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>`
    },
    {
        iframe: `<iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FHatcafeandtea%2Fposts%2Fpfbid025AGskBtj5yqGH7BMZr92bEdScP1H2gTNTA7ap16zUNg1DWscmLTF9s5dAgi5EJqzl&show_text=true&width=500" width="500" height="628" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>`
    },
    {
        iframe: `<iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FHatcafeandtea%2Fposts%2Fpfbid02aP78vdGGHwPJphu6TGdqttxFjfuL5stbWSDc6gaJY54bYVg8VbxN1JK1s9hn87vAl&show_text=true&width=500" width="500" height="722" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>`
    },
    {
        iframe: `<iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FHatcafeandtea%2Fposts%2Fpfbid0JJ1uiFi1jUmXugJ7Zj4QvFzjtFZYKrXP4M1FkNV4jyt5eMe6WXCd27ZrMeDzjSbnl&show_text=true&width=500" width="500" height="618" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>`
    },
    {
        iframe: `<iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FHatcafeandtea%2Fposts%2Fpfbid0jXS1J1A1tUrAipNKS6hyJfhhCqidGFKzXe6fLdQFbNY2oiqTtKyFbBaPTbCtwCPel&show_text=true&width=500" width="500" height="609" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>`
    },
    {
        iframe: `<iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FHatcafeandtea%2Fposts%2Fpfbid0VqaogozFZrHGbLxtHSRGWzUPkcnZC888i4YKpQDBF4DBYTjv3hFwmR9jFHmzrJWhl&show_text=true&width=500" width="500" height="250" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>`
    },
    {
        iframe: `<iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FHatcafeandtea%2Fposts%2Fpfbid0faxtU2FVjjVsZCTVmM7qwXB99LA7H265ZHnUjCjxQUmknQo4zb4Dt2BXTSGJPSMXl&show_text=true&width=500" width="500" height="722" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>`
    },
    {
        iframe: ``
    }
    
];

// Hiển thị danh sách bài viết
document.addEventListener("DOMContentLoaded", () => {
    const newsList = document.getElementById("news-list");

    newsData.forEach(news => {
        const newsCard = document.createElement("div");
        newsCard.className = "news-card";
        newsCard.innerHTML = `
            <div class="content">
                ${news.iframe}
            </div>
        `;
        newsList.appendChild(newsCard);
    });
});
