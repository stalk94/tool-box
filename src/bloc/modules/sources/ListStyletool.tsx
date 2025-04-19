import React from 'react';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { FormatListBulleted, FormatListNumbered } from '@mui/icons-material';
import { useSlate } from 'slate-react';
import { Editor, Transforms } from 'slate';

const listTypes = [
  { label: '● Круги', value: 'disc' },
  { label: '■ Квадраты', value: 'square' },
  { label: '– Чёрточки', value: 'dash' },
  { label: '1. Цифры', value: 'decimal' },
];

export const ListStyleToolbar: React.FC = () => {
  const editor = useSlate();
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchor(e.currentTarget);
  };

  const handleSelect = (style: string) => {
    const [match] = Editor.nodes(editor, {
      match: n => !Editor.isEditor(n) && n.type === 'bulleted-list',
    });

    if (match) {
      Transforms.setNodes(
        editor,
        { listStyleType: style },
        { match: n => !Editor.isEditor(n) && n.type === 'bulleted-list' }
      );
    }
    setAnchor(null);
  };

  return (
    <>
      <Tooltip title="Стиль маркера">
        <IconButton size="small" onClick={handleOpen}>
          <FormatListBulleted sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
      >
        {listTypes.map((item) => (
          <MenuItem key={item.value} onClick={() => handleSelect(item.value)}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}