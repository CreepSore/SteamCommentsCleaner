"use strict";
const fetch = require("node-fetch").default;
const { parse } = require("node-html-parser");

class Comment {
    constructor() {
        /** @type {String} */
        this.id = "";
        /** @type {String} */
        this.text = "";
    }
}

class SteamApi {
    constructor(steamId, sessionId, steamLoginSecure) {
        this._steamId = steamId;
        this._sessionId = sessionId;
        this._steamLoginSecure = steamLoginSecure;
    }

    deleteComment(commentId) {
        return new Promise((res, rej) => {
            const params = new URLSearchParams();
            params.append("gidcomment", commentId);
            params.append("start", "0");
            params.append("count", "6");
            params.append("sessionid", this._sessionId);
            params.append("feature2", "-1");

            fetch(`https://steamcommunity.com/comment/Profile/delete/${this._steamId}/-1/`, {
                method: "POST",
                body: params,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36",
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "Cookie": `sessionid=${this._sessionId}; steamLoginSecure=${this._steamLoginSecure}`,
                    "X-Requested-With": "XMLHttpRequest",
                    "X-Prototype-Version": "1.7"
                }
            }).then(res => res.json())
                .then(res)
                .catch(rej);
        });
    }

    /** @returns {Promise<Array<Comment>>} */
    fetchComments(start, count) {
        return new Promise((res, rej) => {
            const params = new URLSearchParams();
            params.append("sessionid", this._sessionId);
            params.append("feature2", "-1");
            params.append("start", start);
            params.append("count", count);

            fetch(`https://steamcommunity.com/comment/Profile/render/${this._steamId}/-1/`, {
                method: "POST",
                body: params
            }).then(res => res.json())
                .then(resJson => {
                    const root = parse(resJson.comments_html);
                    const commentElements = root.querySelectorAll(".commentthread_comment");

                    const parsedComments = [];
                    commentElements.forEach(comment => {
                        parsedComments.push({
                            id: comment.id.substring(8),
                            text: root.querySelector(`#comment_content_${comment.id.substring(8)}`).innerHTML
                        });
                    });
                    res(parsedComments);
                }).catch(rej);
        });
    }
}

module.exports = {
    SteamApi
}
