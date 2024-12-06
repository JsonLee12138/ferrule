import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Tooltip,
} from '@mui/material';
import React, { useCallback } from 'react';
import { RiFileList3Line } from 'react-icons/ri';
import { IoIosMore } from 'react-icons/io';
import { GoPlus } from 'react-icons/go';
import { useSafeState } from 'ahooks';
import type { AnyObject } from '@/types';
import { Outlet, useNavigate } from 'react-router';

function Note() {
  const [noteList, setNoteList] = useSafeState<AnyObject[]>([]);
  const navigate = useNavigate();
  const handleAdd = useCallback(()=> {
    const newPage = {id: Math.round(Math.random() * 10000), title: ''}
    setNoteList(prev=> [...prev, newPage]);
    navigate(`/${newPage.id}`);
  }, [])
  return (
    <div className="w-screen h-screen flex bg-white/50">
      <aside className="w-[200px] h-full shadow shrink-0">
        <List
          sx={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
          component="nav"
          subheader={
            <ListSubheader
              component="div"
              className="flex items-center justify-between"
              sx={{ backgroundColor: 'transparent', lineHeight: '2' }}
            >
              <span>笔记</span>
              <Tooltip title="添加子页面">
                <div className="hover:bg-stone-300 ml-2 p-0.5 rounded-sm cursor-pointer" onClick={handleAdd}>
                  <GoPlus />
                </div>
              </Tooltip>
            </ListSubheader>
          }
        >
          {noteList.map((item) => (
            <ListItem sx={{ padding: '0' }} key={item.id}>
              <ListItemButton sx={{ padding: '6px 8px' }}>
                <ListItemIcon
                  sx={{ minWidth: '0', width: 'fit-content', padding: '8px' }}
                >
                  <RiFileList3Line size={16} />
                </ListItemIcon>
                <ListItemText>
                  <span className="text-sm">{item.title || '新页面'}</span>
                </ListItemText>
                <div className="flex">
                  <div className="hover:bg-stone-300 ml-2 p-0.5 rounded-sm">
                    <IoIosMore />
                  </div>
                  <Tooltip title="添加子页面">
                    <div className="hover:bg-stone-300 ml-2 p-0.5 rounded-sm">
                      <GoPlus />
                    </div>
                  </Tooltip>
                </div>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </aside>
      <main className='flex-1 overflow-hidden'>
        <Outlet />
      </main>
    </div>
  );
}

export default Note;
