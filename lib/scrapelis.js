"use strict";
const axios = require("axios");
const fs = require("fs");
const fetch = require('node-fetch')
const { load } = require('cheerio')
const cheerio = require('cheerio')

const safeLoad = async (url, options = {}) => {
try {
const { data: pageData } = await axios.get(url, options)
const $ = load(pageData) 
return $
} catch (err) {
if (err.response)
throw new Error(err.response.statusText)
throw err }}

const searchC = async (query, numberPage = 1) => {
const $ = await safeLoad(`https://cuevana3.info/page/${numberPage}/`, {
params: { s: query }})
const resultSearch = []
$(".results-post > article").each((_, e) => {
const element = $(e)
const title = element.find("header > h2").text()
const link = element.find(".lnk-blk").attr("href")
resultSearch.push({ title: title, link: link })})
return resultSearch }

const searchP = async (query, numberPage = 1) => { 
const $ = await safeLoad(`https://pelisplushd.cx/search/`, {
params: { s: query, page: numberPage }})
const resultSearch = []
$("a[class^='Posters']").each((_, e) => {
const element = $(e)
const title = element.find(".listing-content > p").text()
const link = element.attr("href")
resultSearch.push({ title: title,  link: link })})
return resultSearch }

module.exports = { searchC, searchP }
