"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePdf = void 0;
const generator_1 = require("@pdfme/generator");
const ui_1 = require("@pdfme/ui");
const https_1 = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const crypto_1 = require("crypto");
admin.initializeApp();
exports.generatePdf = (0, https_1.onCall)(async (request) => {
    const template = {
        schemas: [{
            title: {
                type: "text",
                position: {
                    x: 52.2,
                    y: 10.85
                },
                width: 111.46,
                height: 6.99,
                alignment: "center",
                fontSize: 28,
                characterSpacing: 0,
                lineHeight: 1,
                fontName: "Roboto"
            },
        }],
        basePdf: ui_1.BLANK_PDF,
    };
    const inputs = [{
        title: request.data.title,
    }];
    const feedback = request.data.feedback;
    const rubric = request.data.rubric;
    for (let i = 0; i < feedback.length; i++) {
        const requirement = rubric[i];
        template.schemas[0][`requirement${i + 1}`] = {
            type: "text",
            position: {
                x: 17.8,
                y: (10 * i) + 40
            },
            width: 176,
            height: 7,
            alignment: "left",
            fontSize: 14,
            characterSpacing: 0,
            lineHeight: 1,
            fontName: "Roboto"
        };
        inputs[0][`requirement${i + 1}`] = `${requirement.text}: ${requirement.pointsEarned}/${requirement.pointsPossible}`;
    }

    template.schemas[0][`feedback`] = {
        type: "text",
        position: {
            x: 17.8,
            y: rubric.length * 10 + 50
        },
        width: 176,
        height: 7,
        alignment: "left",
        fontSize: 14,
        characterSpacing: 0,
        lineHeight: 1,
        fontName: "Roboto"
    };
    inputs[0][`feedback`] = feedback;

    const pdf = await (0, generator_1.generate)({ template, inputs });
    const fileId = (0, crypto_1.randomUUID)();
    const bucket = admin.storage().bucket();
    const destFile = bucket.file(`results/${fileId}.pdf`);
    const stream = destFile.createWriteStream({
        metadata: {
            contentType: "application/pdf",
        },
    });
    await new Promise((resolve, reject) => {
        stream.on("error", (err) => {
            reject(err);
        });
        stream.on("finish", () => {
            resolve(null);
        });
        stream.end(pdf);
    });
    await destFile.makePublic();
    const url = destFile.publicUrl();
    return {
        fileUrl: url,
        filePath: `results/${fileId}.pdf`,
    };
});
//# sourceMappingURL=index.js.map