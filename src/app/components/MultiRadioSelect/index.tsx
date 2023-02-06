import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
import ExitIcon from '@mui/icons-material/HighlightOff';
import {
  Box,
  IconButton,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControl,
  Divider,
  Tooltip,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
} from '@mui/material';
import {
  MultiRadioSelectMenuStyle,
  ColumnMenuStyle,
  GroupMenuStyle,
  MenuLabelStyle,
  SelectStyle,
  GroupLabelStyle,
  DividerStyle,
  IconBoxStyle, ExitContainerStyle, ExitIconStyle,
} from './styles';
import { SxProps } from '@mui/system';

export interface IGrpItm {
  groupId: string;
  itemId: string;
  itemName?: string;
}

interface IGrpItmIndex extends IGrpItm {
  groupIndex: number;
}

export interface IItem {
  id: string;
  name: string;
  description: string;
  disabled?: boolean;
  selected?: boolean;
}

export interface IGroup {
  groupId: string;
  groupName: string;
  groupIndex: number;
}

export type TSelectedValue = IGrpItm[];
export type TValueSet = { columns: { group: IGroup; items: IItem[] }[] }[];

export interface RowMenuProps {
  needsSelection: Boolean;
  key: string;
  groupName: string;
  items: IItem[],
}

export interface ColumnMenuProps {
  rows: RowMenuProps[]
}

// Groups in the value param have to be in the same order
// of the ones in valueSet.
export interface MultiRadioSelectProps {
  valueSet: ColumnMenuProps[];
  onChange?: (groupSelection: any, itemSelection: any) => void;
  sx?: SxProps<Theme>;
  menuSx?: SxProps<Theme>;
  mobileIcon?: JSX.Element;
  className?: string;
}

export function MultiRadioSelect(props: MultiRadioSelectProps) {
  const handleChange = props.onChange ? props.onChange : () => {};
  const valueSet = props.valueSet;
  const sx = props.sx;
  const menuSx = props.menuSx;
  const className = props.className ?? ''
  const MobileIcon = () => props.mobileIcon ?? <></>;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('def'));

  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const handleChangeRadioGroup = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    handleChange(key, event.target.value);
  };
  const values = valueSet.map(({rows}) => rows.map(({items}) => items.find(x => x.selected)?.id)).flat().filter(x => x);
  const renderSelectedValue = () => valueSet.map(({rows}) => rows.map(({items}) => items.find(x => x.selected)?.name)).flat().filter(x => x).join(' - ');

  return (
    <FormControl sx={sx} className={className}>
    {/*<FormControl sx={{...SelectContainerStyle,...sx}}>*/}
      <Select
        multiple
        value={values}
        renderValue={() => isMobile ? <Box sx={IconBoxStyle}><MobileIcon /></Box> : renderSelectedValue() }
        open={isOpen}
        onOpen={()=>setIsOpen(true)}
        onClose={()=>setIsOpen(false)}
        sx={SelectStyle}
        className={`MultiRadioSelect ${isOpen?'MultiRadioSelect-open':''}`}
        MenuProps={{ sx: menuSx }}
      >
        <Box sx={ExitContainerStyle}>
          <IconButton
            sx={ExitIconStyle}
            color={'default'}
            component={'label'}
            onClick={()=>setIsOpen(false)}
          >
            <ExitIcon fontSize={'medium'}/>
          </IconButton>
        </Box>
        {/*@ts-ignore*/}
        <Box className={'MultiRadioSelectMenu'} sx={MultiRadioSelectMenuStyle}>
          {valueSet.map(({rows}, cIndex) => (
            <Box
              className={'MultiRadioSelectMenuColumn'}
              sx={ColumnMenuStyle}
              key={cIndex}
            >
              {rows.map(row => (
                <div key={row.key} className={`${row.needsSelection ? 'NeedsSelection' : ''}`}>
                  {row.groupName && (
                    <>
                      <Typography
                        className={`MultiRadioSelectMenuGroupLabel`}
                        sx={GroupLabelStyle}
                      >
                        {row.groupName}
                      </Typography>
                      <Divider sx={DividerStyle} />
                    </>
                  )}
                  <RadioGroup
                    sx={GroupMenuStyle}
                    aria-labelledby={`${row.key}-radio-group-label`}
                    onChange={(event) => handleChangeRadioGroup(event, row.key)}
                  >
                    {row.items.map(item => {
                      return (
                        <MenuItem key={item.id} disableGutters>
                          <FormControlLabel
                            className={`MultiRadioSelectMenuItem ${item.selected?'MultiRadioSelectMenuItem-selected':''}`}
                            //See Sorting fields note.
                            value={item.id}
                            control={<Radio />}
                            disabled={item.disabled}
                            checked={item.selected}
                            label={
                              <Box sx={MenuLabelStyle}>
                                <span aria-label={item.name}>{item.name}</span>
                                {isMobile ? (
                                  <Typography variant={'caption'}>
                                    {item.description}
                                  </Typography>
                                ) : (
                                  <Tooltip title={item.description}>
                                    <InfoIcon fontSize={'small'} />
                                  </Tooltip>
                                )}
                              </Box>
                            }
                          />
                        </MenuItem>
                      );
                    })}
                  </RadioGroup>
                </div>
              ))}
            </Box>
          ))}
        </Box>
      </Select>
    </FormControl>
  );
}

export default MultiRadioSelect;
