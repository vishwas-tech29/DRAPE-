const OpenAI = require('openai');
const axios = require('axios');
const logger = require('../config/logger');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const retryWithBackoff = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

exports.detectOutfit = async (imageUrl) => {
  try {
    return await retryWithBackoff(async () => {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this fashion photo and return a JSON object containing: detected items array where each item has a label describing the clothing piece, a confidence score between 0 and 1, and an attributes object containing color, fabric type, pattern, occasion, and style category. Also return a tags array of all relevant searchable keywords for this outfit.',
              },
              {
                type: 'image_url',
                image_url: { url: imageUrl },
              },
            ],
          },
        ],
        max_tokens: 1000,
      });

      const content = response.choices[0].message.content;
      return JSON.parse(content);
    });
  } catch (error) {
    logger.error(`AI outfit detection failed: ${error.message}`);
    return { detectedItems: [], tags: [] };
  }
};

exports.generateProductTags = async (imageUrl) => {
  try {
    return await retryWithBackoff(async () => {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this fashion product photo and return a JSON object with: product name suggestion, category, subcategory, fabric type, pattern, occasion tags array, style tags array, color name, and a description of 2 sentences.',
              },
              {
                type: 'image_url',
                image_url: { url: imageUrl },
              },
            ],
          },
        ],
        max_tokens: 800,
      });

      const content = response.choices[0].message.content;
      return JSON.parse(content);
    });
  } catch (error) {
    logger.error(`AI product tagging failed: ${error.message}`);
    return null;
  }
};

exports.generateDesignCards = async (imageUrl, productName) => {
  try {
    const styles = [
      'editorial style',
      'minimal clean style',
      'bold vibrant style',
      'festive Indian aesthetic',
      'luxury premium look',
      'street style urban look',
      'soft pastel feminine look',
      'dark dramatic look',
    ];

    const designCards = [];

    for (const style of styles) {
      try {
        const response = await axios.post(
          'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
          {
            text_prompts: [
              {
                text: `Product card design for ${productName}, ${style}, professional photography, clean background, high quality`,
                weight: 1,
              },
            ],
            cfg_scale: 7,
            height: 1024,
            width: 1024,
            samples: 1,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
            },
          }
        );

        if (response.data.artifacts && response.data.artifacts.length > 0) {
          designCards.push({
            base64: response.data.artifacts[0].base64,
            styleLabel: style,
          });
        }
      } catch (error) {
        logger.error(`Design card generation failed for ${style}: ${error.message}`);
      }
    }

    return designCards;
  } catch (error) {
    logger.error(`AI design card generation failed: ${error.message}`);
    return [];
  }
};

exports.generateTryOn = async (productImageUrl, avatarImageUrl) => {
  try {
    logger.info('Virtual try-on generation - using placeholder implementation');
    return {
      resultUrl: productImageUrl,
      message: 'Try-on feature in development',
    };
  } catch (error) {
    logger.error(`AI try-on generation failed: ${error.message}`);
    return null;
  }
};
