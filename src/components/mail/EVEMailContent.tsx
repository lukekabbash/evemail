import React from 'react';
import { Box } from '@mui/material';
import DOMPurify from 'dompurify';

interface EVEMailContentProps {
  content: string;
}

const EVEMailContent: React.FC<EVEMailContentProps> = ({ content }) => {
  // Process EVE mail content
  const processContent = (text: string) => {
    // Replace showinfo links with styled spans
    text = text.replace(
      /<a href="showinfo:(\d+)\/\/(\d+)">([^<]+)<\/a>/g,
      '<span class="eve-link">$3</span>'
    );

    // Replace regular links
    text = text.replace(
      /<a href="([^"]+)">([^<]+)<\/a>/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="eve-link">$2</a>'
    );

    // Process font tags while preserving color
    text = text.replace(
      /<font([^>]+)>([^<]+)<\/font>/g,
      (match, attributes, content) => {
        const colorMatch = attributes.match(/color="#([^"]+)"/);
        const color = colorMatch ? `#${colorMatch[1]}` : '#000000';
        return `<span style="color: ${color}">${content}</span>`;
      }
    );

    // Convert line breaks
    text = text.replace(/<br>/g, '<br />');

    return text;
  };

  const sanitizedContent = DOMPurify.sanitize(processContent(content), {
    ALLOWED_TAGS: ['span', 'a', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
  });

  return (
    <Box
      sx={{
        '& .eve-link': {
          color: '#ffd98d',
          textDecoration: 'none',
          cursor: 'pointer',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
        '& a': {
          color: '#ffffe4',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
        '& span': {
          color: '#000000',
        },
        backgroundColor: '#ffffff',
        color: '#000000',
        p: 2,
        borderRadius: 1,
        whiteSpace: 'pre-wrap',
        '& br': {
          display: 'block',
          content: '""',
          marginTop: '0.5em',
        },
      }}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default EVEMailContent; 