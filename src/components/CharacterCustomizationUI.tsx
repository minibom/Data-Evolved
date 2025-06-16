// src/components/CharacterCustomizationUI.tsx
"use client";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, UserCircle2, Save } from "lucide-react";
import Image from 'next/image';

// This is a very basic placeholder. A real customization UI would be much more complex,
// potentially involving a 2D/3D renderer for the character preview.

export default function CharacterCustomizationUI() {
  const [entityName, setEntityName] = useState("DataEntity_1337");
  const [primaryColor, setPrimaryColor] = useState("#3498db"); // Default blue
  const [secondaryColor, setSecondaryColor] = useState("#2ecc71"); // Default green
  const [pattern, setPattern] = useState("circuit_lines");

  const handleSave = () => {
    console.log("Saving character customization:", { entityName, primaryColor, secondaryColor, pattern });
    // TODO: API call to save customization
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <UserCircle2 className="mr-2 h-6 w-6 text-primary" />
          Data Entity Customization
        </CardTitle>
        <CardDescription>Define your unique digital signature in the Quantum Nexus.</CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="entityName">Entity Name</Label>
            <Input id="entityName" value={entityName} onChange={(e) => setEntityName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="primaryColor">Primary Color</Label>
            <Input id="primaryColor" type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-10" />
          </div>
          <div>
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <Input id="secondaryColor" type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="h-10" />
          </div>
          <div>
            <Label htmlFor="pattern">Visual Pattern</Label>
            <Select value={pattern} onValueChange={setPattern}>
              <SelectTrigger id="pattern">
                <SelectValue placeholder="Select a pattern" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="circuit_lines">Circuit Lines</SelectItem>
                <SelectItem value="binary_code">Binary Code</SelectItem>
                <SelectItem value="hex_grid">Hex Grid</SelectItem>
                <SelectItem value="data_stream">Data Stream</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center bg-muted/50 rounded-lg p-4 aspect-square">
          <Palette className="h-24 w-24 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">Character Preview Area</p>
          {/* In a real app, this would be a canvas or image reflecting choices */}
          <div 
            className="mt-4 w-32 h-32 border-2 rounded" 
            style={{ 
              borderColor: secondaryColor,
              background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
              // Add pattern visualization here if possible with CSS or SVG
            }} 
            title={`Pattern: ${pattern}`}
          ></div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          Save Configuration
        </Button>
      </CardFooter>
    </Card>
  );
}
