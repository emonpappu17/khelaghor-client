"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useTableSearchParams } from "@/hooks/use-table-search-params"

interface Option {
    label: string
    value: string
}

interface DataTableFacetedFilterProps {
    paramKey: string
    title: string
    options: Option[]
}

export function DataTableFacetedFilter({
    paramKey,
    title,
    options,
}: DataTableFacetedFilterProps) {
    const { get, setParams } = useTableSearchParams()
    const selected = get(paramKey)

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed">
                    {title}
                    {selected && (
                        <Badge
                            variant="secondary"
                            className="ml-2 rounded-sm px-1 font-normal"
                        >
                            {options.find((o) => o.value === selected)?.label ?? selected}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-50 p-0" align="start">
                <Command>
                    <CommandList>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    onSelect={() =>
                                        setParams({
                                            [paramKey]:
                                                selected === option.value ? undefined : option.value,
                                        })
                                    }
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4 ",
                                            selected === option.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
