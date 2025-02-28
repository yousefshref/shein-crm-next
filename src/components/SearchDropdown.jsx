'use client';
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

export default function SearchDropdown({
    items = [],
    placeholder = "Search...",
    onSelect,
    defaultValue = "",
    disabled
}) {
    const [search, setSearch] = useState("");


    useEffect(() => {
        setSearch(defaultValue);
    }, [defaultValue]);

    return (
        <Popover>
            <PopoverTrigger>
                <Input
                    disabled={disabled}
                    placeholder={placeholder}
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        if (onSelect) onSelect(e.target.value);
                    }}
                    className="w-full bg-white"
                />
            </PopoverTrigger>
            <PopoverContent className="w-full p-1">
                <Command>
                    <CommandInput placeholder="Type a command or search..." />
                    <CommandList>
                        <CommandGroup>
                            {items?.filter((item) => item.toLowerCase().includes(search.toLowerCase()))
                                .map((item, index) => (
                                    <CommandItem
                                        key={index}
                                        onSelect={() => {
                                            setSearch(item);
                                            if (onSelect) onSelect(item);
                                        }}
                                    >
                                        <Check className={`mr-2 h-4 w-4 ${search === item ? "opacity-100" : "opacity-0"}`} />
                                        {item}
                                    </CommandItem>
                                ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover >
    );
}
