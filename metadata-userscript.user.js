// ==UserScript==
// @name         Generate Calibre Metadata from AO3
// @namespace    http://tampermonkey.net/
// @version      2024-06-18
// @description  Generates calibre metadata from an ao3 blurb
// @author       QwertyNerd97
// @match        https://archiveofourown.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archiveofourown.org
// @grant        none
// ==/UserScript==

const escapeHtml = (unsafe) => {
    return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function generateTextData({ title, titlesort, authors, tags, comments, contentRating, fandoms, relationships, warnings, words, series, seriesNum }) {
    const seriesValue = series ? `Series : ${series} #${seriesNum}\n` : "";
    const metadata = `Title : ${title}\n` +
          `Title sort : ${titlesort}\n` +
          `Author(s) : ${authors.join(" & ")} [${authors.join(" & ")}]\n` +
          `Publisher : Archive Of Our Own\n` +
          `Tags : ${tags.join(", ")}\n` +
          `Comments : ${comments}\n` +
          `Content Rating : ${contentRating}\n` +
          `Fandoms : ${fandoms.join(", ")}\n` +
          seriesValue +
          `Genre : Fanfic\n` +
          `Relationships : ${contentRating}\n` +
          `Content Warnings : ${warnings.join(", ")}\n` +
          `Word Count : ${words.replace(",","")}\n`;
    console.log("Copied metadata: " + metadata);
    const type = "text/plain";
    const blob = new Blob([metadata], { type });
    return { [type]: blob };
}

function generateCalibreMetadata({ title, titlesort, authors, tags, comments, contentRating, fandoms, relationships, warnings, words, series, seriesNum }) {
    const seriesValue = series ? `<meta name="calibre:series" content="${series}"/>\n <meta name="calibre:series_index" content="${seriesNum}"/>\n` : "";
    const metadata = `<?xml version='1.0' encoding='utf-8'?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="uuid_id" version="2.0">
    <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
        <dc:identifier opf:scheme="calibre" id="calibre_id">282</dc:identifier>
        <dc:title>${title}</dc:title>
        ${authors.map(author => `<dc:creator opf:file-as="${authors.join(" &amp; ")}" opf:role="aut">${author}</dc:creator>`)}
        <dc:contributor opf:file-as="calibre" opf:role="bkp">calibre (7.4.0) [https://calibre-ebook.com]</dc:contributor>
        <dc:description>${escapeHtml(comments)}</dc:description>
        <dc:publisher>Archive Of Our Own</dc:publisher>
        <dc:language>eng</dc:language>
        ${tags.map(tag => `<dc:subject>${tag}</dc:subject>`)}
        ${seriesValue}
        <meta name="calibre:title_sort" content="${titlesort}"/>
        <meta name="calibre:user_metadata:#audience" content="{&quot;table&quot;: &quot;custom_column_3&quot;, &quot;column&quot;: &quot;value&quot;, &quot;datatype&quot;: &quot;enumeration&quot;, &quot;is_multiple&quot;: null, &quot;kind&quot;: &quot;field&quot;, &quot;name&quot;: &quot;Content Rating&quot;, &quot;search_terms&quot;: [&quot;#audience&quot;], &quot;label&quot;: &quot;audience&quot;, &quot;colnum&quot;: 3, &quot;display&quot;: {&quot;enum_values&quot;: [&quot;General Audiences&quot;, &quot;Teen And Up Audiences&quot;, &quot;Mature&quot;, &quot;Explicit&quot;], &quot;enum_colors&quot;: [&quot;green&quot;, &quot;yellow&quot;, &quot;orange&quot;, &quot;red&quot;], &quot;use_decorations&quot;: false, &quot;description&quot;: &quot;&quot;}, &quot;is_custom&quot;: true, &quot;is_category&quot;: true, &quot;link_column&quot;: &quot;value&quot;, &quot;category_sort&quot;: &quot;value&quot;, &quot;is_csp&quot;: false, &quot;is_editable&quot;: true, &quot;rec_index&quot;: 22, &quot;#value#&quot;: ${contentRating}, &quot;#extra#&quot;: null, &quot;is_multiple2&quot;: {}}"/>
        <meta name="calibre:user_metadata:#fandom" content="{&quot;table&quot;: &quot;custom_column_2&quot;, &quot;column&quot;: &quot;value&quot;, &quot;datatype&quot;: &quot;text&quot;, &quot;is_multiple&quot;: &quot;|&quot;, &quot;kind&quot;: &quot;field&quot;, &quot;name&quot;: &quot;Fandoms&quot;, &quot;search_terms&quot;: [&quot;#fandom&quot;], &quot;label&quot;: &quot;fandom&quot;, &quot;colnum&quot;: 2, &quot;display&quot;: {&quot;is_names&quot;: false, &quot;description&quot;: &quot;&quot;}, &quot;is_custom&quot;: true, &quot;is_category&quot;: true, &quot;link_column&quot;: &quot;value&quot;, &quot;category_sort&quot;: &quot;value&quot;, &quot;is_csp&quot;: false, &quot;is_editable&quot;: true, &quot;rec_index&quot;: 23, &quot;#value#&quot;: [${fandoms.map(fandom => `&quot;${fandom}&quot;`).join(", ")}], &quot;#extra#&quot;: null, &quot;is_multiple2&quot;: {&quot;cache_to_list&quot;: &quot;|&quot;, &quot;ui_to_list&quot;: &quot;,&quot;, &quot;list_to_ui&quot;: &quot;, &quot;}}"/>
        <meta name="calibre:user_metadata:#genre" content="{&quot;table&quot;: &quot;custom_column_1&quot;, &quot;column&quot;: &quot;value&quot;, &quot;datatype&quot;: &quot;text&quot;, &quot;is_multiple&quot;: null, &quot;kind&quot;: &quot;field&quot;, &quot;name&quot;: &quot;Genre&quot;, &quot;search_terms&quot;: [&quot;#genre&quot;], &quot;label&quot;: &quot;genre&quot;, &quot;colnum&quot;: 1, &quot;display&quot;: {&quot;use_decorations&quot;: false, &quot;description&quot;: &quot;&quot;}, &quot;is_custom&quot;: true, &quot;is_category&quot;: true, &quot;link_column&quot;: &quot;value&quot;, &quot;category_sort&quot;: &quot;value&quot;, &quot;is_csp&quot;: false, &quot;is_editable&quot;: true, &quot;rec_index&quot;: 24, &quot;#value#&quot;: Fanfic, &quot;#extra#&quot;: null, &quot;is_multiple2&quot;: {}}"/>
        <meta name="calibre:user_metadata:#relationships" content="{&quot;table&quot;: &quot;custom_column_4&quot;, &quot;column&quot;: &quot;value&quot;, &quot;datatype&quot;: &quot;enumeration&quot;, &quot;is_multiple&quot;: null, &quot;kind&quot;: &quot;field&quot;, &quot;name&quot;: &quot;Relationships&quot;, &quot;search_terms&quot;: [&quot;#relationships&quot;], &quot;label&quot;: &quot;relationships&quot;, &quot;colnum&quot;: 4, &quot;display&quot;: {&quot;enum_values&quot;: [&quot;F/F&quot;, &quot;F/M&quot;, &quot;Gen&quot;, &quot;M/M&quot;, &quot;Multi&quot;], &quot;enum_colors&quot;: [&quot;red&quot;, &quot;purple&quot;, &quot;green&quot;, &quot;blue&quot;, &quot;brown&quot;], &quot;use_decorations&quot;: false, &quot;description&quot;: &quot;&quot;}, &quot;is_custom&quot;: true, &quot;is_category&quot;: true, &quot;link_column&quot;: &quot;value&quot;, &quot;category_sort&quot;: &quot;value&quot;, &quot;is_csp&quot;: false, &quot;is_editable&quot;: true, &quot;rec_index&quot;: 26, &quot;#value#&quot;: ${relationships}, &quot;#extra#&quot;: null, &quot;is_multiple2&quot;: {}}"/>
        <meta name="calibre:user_metadata:#warnings" content="{&quot;table&quot;: &quot;custom_column_5&quot;, &quot;column&quot;: &quot;value&quot;, &quot;datatype&quot;: &quot;enumeration&quot;, &quot;is_multiple&quot;: null, &quot;kind&quot;: &quot;field&quot;, &quot;name&quot;: &quot;Content Warnings&quot;, &quot;search_terms&quot;: [&quot;#warnings&quot;], &quot;label&quot;: &quot;warnings&quot;, &quot;colnum&quot;: 5, &quot;display&quot;: {&quot;enum_values&quot;: [&quot;Author Chose Not To Use Archive Warnings&quot;, &quot;Graphic Depictions Of Violence&quot;, &quot;Major Character Death&quot;, &quot;No Archive Warnings Apply&quot;, &quot;Rape/Non-Con&quot;, &quot;Underage&quot;], &quot;enum_colors&quot;: [&quot;orange&quot;, &quot;red&quot;, &quot;red&quot;, &quot;green&quot;, &quot;red&quot;, &quot;red&quot;], &quot;use_decorations&quot;: false, &quot;description&quot;: &quot;&quot;}, &quot;is_custom&quot;: true, &quot;is_category&quot;: true, &quot;link_column&quot;: &quot;value&quot;, &quot;category_sort&quot;: &quot;value&quot;, &quot;is_csp&quot;: false, &quot;is_editable&quot;: true, &quot;rec_index&quot;: 27, &quot;#value#&quot;: [${warnings.map(warning => `&quot;${warning}&quot;`).join(", ")}], &quot;#extra#&quot;: null, &quot;is_multiple2&quot;: {}}"/>
        <meta name="calibre:user_metadata:#wip" content="{&quot;table&quot;: &quot;custom_column_6&quot;, &quot;column&quot;: &quot;value&quot;, &quot;datatype&quot;: &quot;bool&quot;, &quot;is_multiple&quot;: null, &quot;kind&quot;: &quot;field&quot;, &quot;name&quot;: &quot;Work In Progress&quot;, &quot;search_terms&quot;: [&quot;#wip&quot;], &quot;label&quot;: &quot;wip&quot;, &quot;colnum&quot;: 6, &quot;display&quot;: {&quot;description&quot;: &quot;&quot;}, &quot;is_custom&quot;: true, &quot;is_category&quot;: false, &quot;link_column&quot;: &quot;value&quot;, &quot;category_sort&quot;: &quot;value&quot;, &quot;is_csp&quot;: false, &quot;is_editable&quot;: true, &quot;rec_index&quot;: 28, &quot;#value#&quot;: null, &quot;#extra#&quot;: null, &quot;is_multiple2&quot;: {}}"/>
        <meta name="calibre:user_metadata:#wordcount" content="{&quot;table&quot;: &quot;custom_column_7&quot;, &quot;column&quot;: &quot;value&quot;, &quot;datatype&quot;: &quot;int&quot;, &quot;is_multiple&quot;: null, &quot;kind&quot;: &quot;field&quot;, &quot;name&quot;: &quot;Word Count&quot;, &quot;search_terms&quot;: [&quot;#wordcount&quot;], &quot;label&quot;: &quot;wordcount&quot;, &quot;colnum&quot;: 7, &quot;display&quot;: {&quot;number_format&quot;: null, &quot;description&quot;: &quot;&quot;}, &quot;is_custom&quot;: true, &quot;is_category&quot;: false, &quot;link_column&quot;: &quot;value&quot;, &quot;category_sort&quot;: &quot;value&quot;, &quot;is_csp&quot;: false, &quot;is_editable&quot;: true, &quot;rec_index&quot;: 29, &quot;#value#&quot;: ${words.replace(",","")}, &quot;#extra#&quot;: null, &quot;is_multiple2&quot;: {}}"/>
    </metadata>
    <guide/>
</package>
`;
    console.log("Copied metadata: " + metadata);
    const type = "text/plain";
    const blob = new Blob([metadata], { type });
    return { [type]: blob };
}

function addToList(list, element) {
    const li = document.createElement("li");
    list.appendChild(li);
    li.appendChild(element);
}

(function() {
    'use strict';

    let ficblurbs = document.querySelectorAll('.blurb');
    ficblurbs.forEach(blurb => {
        const id = blurb.id.replace("work_","");
        const title = blurb.querySelector("h4").querySelector("a").textContent;
        const titlesort = title.toLowerCase();
        const authors = Array.from(blurb.querySelector("h4").querySelectorAll("a[rel='author']")).map(tag => tag.textContent);
        const tags = Array.from(blurb.querySelectorAll(".tag")).map(tag => tag.textContent);
        const comments = blurb.querySelector(".summary")?.innerHTML;
        const contentRating = blurb.querySelector(".rating").textContent;
        const fandoms = Array.from(blurb.querySelector(".fandoms").querySelectorAll(".tag")).map(tag => tag.textContent);
        const relationships = blurb.querySelector(".category").textContent;
        const warnings = Array.from(blurb.querySelector("li.warnings").querySelectorAll(".tag")).map(tag => tag.textContent);
        const words = blurb.querySelector("dd.words").textContent;
        const series = blurb.querySelector("ul.series > li > a")?.textContent;
        const seriesNum = blurb.querySelector("ul.series > li > strong")?.textContent;

        const actions = document.createElement("ul");
        actions.className = "actions";
        blurb.appendChild(actions);

        const button = document.createElement("button");
        button.className = "calibre-metadata";
        button.innerText = "Copy Metadata for " + title;
        button.onclick = () => {

            const data = [new ClipboardItem({
                //...generateTextData({ title, titlesort, authors, tags, comments, contentRating, fandoms, relationships, warnings, words, series, seriesNum }),
                ...generateCalibreMetadata({ title, titlesort, authors, tags, comments, contentRating, fandoms, relationships, warnings, words, series, seriesNum })
            })];
            navigator.clipboard.write(data);
        };
        addToList(actions,button);

        const readLater = document.createElement("a");
        readLater.innerText = "Read Later";
        readLater.href = "/works/" + id + "/mark_for_later";
        addToList(actions,readLater);

        const markRead = document.createElement("a");
        markRead.innerText = "Mark As Read";
        markRead.className = "actions";
        markRead.href = "/works/" + id + "/mark_as_read";
        addToList(actions,markRead);
    });
})();
